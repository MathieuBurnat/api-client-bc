import { HttpCode } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  describe('findAll', () => {
    it('should return an array of parts', async () => {
      const result = await service.findAll().statusCode;

      expect(result.HttpCode).toBe(HttpCode.OK);
    });
  }); 
});
