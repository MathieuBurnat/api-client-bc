import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import prisma from '../../lib/prisma';

@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto) {
    return prisma.product.create({
      data: {
        ...createProductDto,
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
        id: id
      }
    });  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
