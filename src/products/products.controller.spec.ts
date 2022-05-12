import { Decimal } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import prisma from '../../lib/prisma';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('Get product', async () => {
    const result = await prisma.product.findMany();
    expect(result[0]).toEqual({
      id: expect.any(String),
      ownerId: expect.any(String),
      name: expect.any(String),
      price: expect.any(Decimal),
      qrcode: expect.any(String),
      published: expect.any(Boolean),
      madeBy: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
