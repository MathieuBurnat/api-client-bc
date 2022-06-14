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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateProductWarrantyDto } from './dto/UpdateProductWarrantyDto';
import { UpdateClientRetriveProductDto } from './dto/update-clientretrive-product.dto';
import { UpdateProductQrcodeDto } from './dto/update-product-qrcode.dto';

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
  };
  const productsService = new ProductsService(new EventEmitter2());
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
      keypair: {
        publicKey: process.env.public_key,
        privateKey: process.env.private_key,
      },
    };
    // Create a product via the service
    product = await productsService.create(createProductDto);

    // Excpect the result to be a product
    expect(product.id).toEqual(productGoal.id);
    expect(product.price).toEqual(productGoal.price);
    expect(product.published).toEqual(productGoal.published);
  });

  it('Get product - Find Many', async () => {
    const result = await productsService.findAll();

    expect(result[0].id).toEqual(productGoal.id);
    expect(result[0].price).toEqual(productGoal.price);
    expect(result[0].published).toEqual(productGoal.published);
  });

  it('Get product - Find one', async () => {
    const product = await prisma.product.findFirst();
    const result = await productsService.findOne(product.id);

    expect(result.id).toEqual(productGoal.id);
    expect(result.price).toEqual(productGoal.price);
    expect(result.published).toEqual(productGoal.published);
  });

  it("Extend product's warranty", async () => {
    const product = await prisma.product.findFirst();

    let updateProductWarrantyDto = new UpdateProductWarrantyDto();
    updateProductWarrantyDto = {
      ...updateProductWarrantyDto,
      id: product.id,
      delay: 360,
      keypair: {
        publicKey: process.env.public_key,
        privateKey: process.env.private_key,
      },
    };

    const result = await productsService.extendWarranty(
      updateProductWarrantyDto,
    );

    expect(result.id).toEqual(productGoal.id);
    expect(result.warrantyExpiresOn).toEqual(productGoal.warrantyExpiresOn);
  });

  it('Generate qrcode', async () => {
    let updateProductQrcodeDto = new UpdateProductQrcodeDto();

    updateProductQrcodeDto = {
      ...updateProductQrcodeDto,
      id: product.id,
      keypair: {
        publicKey: process.env.public_key,
        privateKey: process.env.private_key,
      },
    };

    product = await productsService.generateQrcode(updateProductQrcodeDto);

    expect(product.id).toEqual(productGoal.id);
  });

  it('Retrive product', async () => {
    const client = await prisma.client.findFirst();

    let updateClientRetriveProductDto = new UpdateClientRetriveProductDto();

    updateClientRetriveProductDto = {
      ...updateClientRetriveProductDto,
      qrcode: product.qrcode,
      ownerId: client.id,
    };

    const result = await productsService.retrieve(
      updateClientRetriveProductDto,
    );

    expect(result.id).toEqual(productGoal.id);
    expect(result.warrantyExpiresOn).toEqual(productGoal.warrantyExpiresOn);
    expect(result.ownerId).toEqual(productGoal.ownerId);
  });
});
