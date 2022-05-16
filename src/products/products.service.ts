import { Product } from './entities/product.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductWarrantyDto } from './dto/UpdateProductWarrantyDto';
import { UpdateProductDto } from './dto/update-product.dto';
import prisma from '../../lib/prisma';
import { UpdateClientRetriveProductDto } from './dto/update-clientretrive-product.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(private eventEmitter: EventEmitter2) {}

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
    if (product.ownerId != null) {
      return {
        statusCode: '403',
        message: ['We are sorry, this product has already an owner.'],
        error: 'Forbidden',
      };
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
    const product = await this.findOne(updateProductWarrantyDto.id);
    return await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        warrantyExpiresOn: new Date(
          product.warrantyExpiresOn.setDate(
            new Date().getDate() + updateProductWarrantyDto.delay,
          ),
        ),
      },
    });
  }

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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
