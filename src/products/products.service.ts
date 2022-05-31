import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductWarrantyDto } from './dto/UpdateProductWarrantyDto';
import prisma from '../../lib/prisma';
import { UpdateClientRetriveProductDto } from './dto/update-clientretrive-product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { Status } from '@prisma/client';
import { UpdateProductQrcodeDto } from './dto/update-product-qrcode.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(private eventEmitter: EventEmitter2) {}

  findAll() {
    return prisma.product.findMany();
  }

  findOne(id: string) {
    //find one product by id
    return prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneGetEvents(id: string) {
    //find event's product by product's id

    const events = await prisma.event.findMany({
      where: {
        productId: id,
      },
    });

    return events;
  }

  async create(createProductDto: CreateProductDto) {
    const product = await prisma.product.create({
      data: {
        ...createProductDto,
      },
    });

    this.eventEmitter.emit('product.created', product);
    return product;
  }

  async retrieve(updateClientRetriveProductDto: UpdateClientRetriveProductDto) {
    let product = await prisma.product.findUnique({
      where: {
        qrcode: updateClientRetriveProductDto.qrcode,
      },
    });

    //If the product's owner already exist, then it's not possible to retrieve the product
    if (product.ownerId !== null) {
      throw new HttpException(
        'We are sorry, this product is already owned by someone.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Otherwise, update the product with the new owner
    product = await prisma.product.update({
      where: {
        qrcode: updateClientRetriveProductDto.qrcode,
      },
      data: {
        ownerId: updateClientRetriveProductDto.ownerId,
      },
    });

    this.eventEmitter.emit('product.retrieve', product);
    return product;
  }

  async extendWarranty(updateProductWarrantyDto: UpdateProductWarrantyDto) {
    const currentProduct = await this.findOne(updateProductWarrantyDto.id);
    const product = await prisma.product.update({
      where: {
        id: currentProduct.id,
      },
      data: {
        warrantyExpiresOn: new Date(
          currentProduct.warrantyExpiresOn.setDate(
            new Date().getDate() + updateProductWarrantyDto.delay,
          ),
        ),
      },
    });

    this.eventEmitter.emit('product.warranty.extend', product);
    return product;
  }

  async generateQrcode(updateProductQrcodeDto: UpdateProductQrcodeDto) {
    const product = await prisma.product.update({
      where: {
        id: updateProductQrcodeDto.id,
      },
      data: {
        qrcode: uuidv4(),
      },
    });

    this.eventEmitter.emit('product.qrcode.generate', product);
    return product;
  }

  // Return the status that a product could have
  // Status is an enum
  async getStatus() {
    return Status;
  }

  async updateStatus(updateProductStatus: UpdateProductStatusDto) {
    const currentProduct = await this.findOne(updateProductStatus.id);

    // Check if the currentProduct has the same status than the UpdateProductStatusDto
    if (currentProduct.status === updateProductStatus.status) {
      return {
        statusCode: '400',
        message: [
          "The product's status is already " + updateProductStatus.status,
        ],
        error: 'Bad Request',
      };
    }

    // Check if the product's status is valid
    // Then update the product's status
    if (Object.values(Status).includes(updateProductStatus.status)) {
      const product = await prisma.product.update({
        where: {
          id: updateProductStatus.id,
        },
        data: {
          status: updateProductStatus.status,
        },
      });

      this.eventEmitter.emit('product.status.update', product);
      return product;
    } else {
      //otherwise, return an error explaining that the status is invalid
      return {
        statusCode: '400',
        message: [
          "The product's status is invalid. It must be one of the following: " +
            Object.values(Status),
        ],
        error: 'Bad Request',
      };
    }
  }
}
