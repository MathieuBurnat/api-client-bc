import { Decimal } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import prisma from '../../lib/prisma';
import { CreateClientDto } from './dto/create-client.dto';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  it('Get client - Find Many', async () => {
    const result = await prisma.client.findMany();
    expect(result[0]).toEqual(clientGoal);
  });

  it('Get client - Find one', async () => {
    const result = await prisma.client.findFirst();
    expect(result).toEqual(clientGoal);
  });
});
