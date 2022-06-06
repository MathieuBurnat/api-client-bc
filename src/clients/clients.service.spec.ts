import { Get } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import prisma from '../../lib/prisma';
import { CreateClientDto } from './dto/create-client.dto';
import PrismaClient from '@prisma/client';

describe('ClientsController', () => {
  let controller: ClientsController;
  const clientGoal = {
    id: expect.any(String),
    card: expect.any(String),
    firstname: expect.any(String),
    lastname: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    email: expect.any(String),
  };
  const clientsService = new ClientsService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('Create a client', async () => {
    // Create a client dynamically
    let createClientDto = new CreateClientDto();
    createClientDto = {
      ...createClientDto,
      firstname: 'Jorge',
      lastname: 'Tellez',
      email: 'JorgeTellez@mail.ch' + Math.random().toString(16).substr(2, 8),
    };

    // Create a client via the service
    const result = await clientsService.create(createClientDto);

    // Excpect the result to be a client
    expect(result).toEqual(clientGoal);
  });

  it('Get client - Find Many', async () => {
    const result = await clientsService.findAll();
    expect(result[0]).toEqual(clientGoal);
  });

  it('Get client - Find one', async () => {
    // Get first client
    const client = await prisma.client.findFirst();

    // Try to get it via the client service
    const result = await clientsService.findOne(client.id);
    expect(result).toEqual(clientGoal);
  });
});
