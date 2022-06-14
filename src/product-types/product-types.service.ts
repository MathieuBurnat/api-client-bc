import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import prisma from '../../lib/prisma';

@Injectable()
export class ProductTypesService {
  async create(createProductTypeDto: CreateProductTypeDto) {
    return await prisma.productType.create({
      data: {
        ...createProductTypeDto,
      },
    });
  }

  async findAll() {
    return await prisma.productType.findMany();
  }

  async findOne(id: string) {
    return await prisma.productType.findUnique({
      where: {
        id: id,
      },
    });
  }
}
