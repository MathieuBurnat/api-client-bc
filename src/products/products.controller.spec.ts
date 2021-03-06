import { Decimal } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import prisma from '../../lib/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductListener } from '../events/listeners/product.listener';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from '../events/events.service';
import { BlockchainsService } from '../blockchains/blockchains.service';
import { v4 as uuidv4 } from 'uuid';

describe('ProductsController', () => {
  let controller: ProductsController;
  const productGoal = {
    id: expect.any(String),
    ownerId: expect.any(String),
    name: expect.any(String),
    price: expect.any(Decimal),
    published: expect.any(Boolean),
    madeBy: null,
    warrantyExpiresOn: expect.any(Date),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    productTypeId: null,
  };
  let product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        ProductListener,
        EventsService,
        BlockchainsService,
      ],
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
      warrantyExpiresOn: new Date(
        new Date().setDate(new Date().getDate() + 360),
      ),
    };
    // Create a product via the service
    product = await prisma.product.create({
      data: {
        ...createProductDto,
      },
    });

    // Excpect the result to be a product
    expect(product.id).toEqual(productGoal.id);
    expect(product.price).toEqual(productGoal.price);
    expect(product.published).toEqual(productGoal.published);
  });

  it('Get product - Find Many', async () => {
    const result = await prisma.product.findMany();

    expect(result[0].id).toEqual(productGoal.id);
    expect(result[0].price).toEqual(productGoal.price);
    expect(result[0].published).toEqual(productGoal.published);
  });

  it('Get product - Find one', async () => {
    const result = await prisma.product.findFirst();

    expect(result.id).toEqual(productGoal.id);
    expect(result.price).toEqual(productGoal.price);
    expect(result.published).toEqual(productGoal.published);
  });

  it('Generate qrcode', async () => {
    product = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        qrcode: uuidv4(),
      },
    });

    expect(product.id).toEqual(productGoal.id);
    expect(product.warrantyExpiresOn).toEqual(productGoal.warrantyExpiresOn);
  });

  it("Extend product's warranty", async () => {
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

    expect(result.id).toEqual(productGoal.id);
    expect(result.warrantyExpiresOn).toEqual(productGoal.warrantyExpiresOn);
  });

  it('Retrive product', async () => {
    const client = await prisma.client.findFirst();
    const result = await prisma.product.update({
      where: {
        qrcode: product.qrcode,
      },
      data: {
        ownerId: client.id,
      },
    });
    expect(result.id).toEqual(productGoal.id);
    expect(result.warrantyExpiresOn).toEqual(productGoal.warrantyExpiresOn);
    expect(result.ownerId).toEqual(productGoal.ownerId);
  });
});
