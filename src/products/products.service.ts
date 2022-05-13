import { Product } from './entities/product.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductWarrantyDto } from './dto/UpdateProductWarrantyDto';
import { UpdateProductDto } from './dto/update-product.dto';
import prisma from '../../lib/prisma';
import { delay } from 'rxjs';
import { UpdateClientRetriveProductDto } from './dto/update-clientretrive-product.dto';

@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto) {
    return prisma.product.create({
      data: {
        ...createProductDto,
      },
    });
  }

  async retrieve(updateClientRetriveProductDto: UpdateClientRetriveProductDto) {
    return await prisma.product.update({
      where: {
        qrcode: updateClientRetriveProductDto.qrcode,
      },
      data: {
        ownerId: updateClientRetriveProductDto.ownerId,
      },
    });
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
