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
    madeBy: null,
    warrantyExpiresOn: expect.any(Date),
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
      qrcode: Math.random().toString(16).substr(2, 8),
      published: true,
      warrantyExpiresOn: new Date(
        new Date().setDate(new Date().getDate() + 360),
      ),
    };
    // Create a product via the service
    const result = await prisma.product.create({
      data: {
        ...createProductDto,
      },
    });

    // Excpect the result to be a product
    expect(result).toEqual(productGoal);
  });

  it('Get product - Find Many', async () => {
    const result = await prisma.product.findMany();
    expect(result[0]).toEqual(productGoal);
  });

  it('Get product - Find one', async () => {
    const result = await prisma.product.findFirst();
    expect(result).toEqual(productGoal);
  });

  it("Extend product's warranty", async () => {
    const product = await prisma.product.findFirst();
    const result = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        warrantyExpiresOn: new Date(
          new Date().setDate(new Date().getDate() + 360),
        ),
      },
    });
    expect(result).toEqual(productGoal);
  });

  it('Retrive product', async () => {
    const client = await prisma.client.findFirst();
    const product = await prisma.product.findFirst();
    const result = await prisma.product.update({
      where: {
        qrcode: product.qrcode,
      },
      data: {
        ownerId: client.id,
      },
    });
    expect(result).toEqual(productGoal);
  });
});
