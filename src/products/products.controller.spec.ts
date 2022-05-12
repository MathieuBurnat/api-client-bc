import { Decimal } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import prisma from '../../lib/prisma';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  const productGoal = {
    id: expect.any(String),
    ownerId: expect.any(String),
    name: expect.any(String),
    price: expect.any(Decimal),
    qrcode: expect.any(String),
    published: expect.any(Boolean),
    madeBy: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('Create a product', async () => {
    // Create a product dynamically
    let createProductDto = new CreateProductDto();
    createProductDto = {
      ...createProductDto,
      name: 'Product 1',
      price: new Decimal(10.95),
      published: true,
    };
    // Create a product via the service
    const result = await prisma.product.create({
      data: {
        ...createProductDto,
      },
    });

    // Excpect the result to be a product
    expect(result).toEqual({
      id: expect.any(String),
      ownerId: null,
      name: expect.any(String),
      price: expect.any(Decimal),
      qrcode: null,
      published: expect.any(Boolean),
      madeBy: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('Get product - Find Many', async () => {
    const result = await prisma.product.findMany();
    expect(result[0]).toEqual(productGoal);
  });

  it('Get product - Find one', async () => {
    const result = await prisma.product.findFirst();
    expect(result).toEqual(productGoal);
  });
});
