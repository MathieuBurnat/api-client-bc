import { Test, TestingModule } from '@nestjs/testing';
import { isBoolean } from 'class-validator';
import { BlockchainsService } from './blockchains.service';
import prisma from '../../lib/prisma';

describe('BlockchainsService', () => {
  let service: BlockchainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainsService],
    }).compile();

    service = module.get<BlockchainsService>(BlockchainsService);
  });

  it('Generate keys', async () => {
    // Create a client via the service
    const result = await service.generateKeys();
    expect(result).toEqual({
      publicKey: expect.any(String),
      privateKey: expect.any(String),
    });
  });

  it('Certify Entity', async () => {
    const pk = 'Gi1pvrHrz4gDvZiQPZKVswpLV3bp5P1WzJHsTJgayMbK';
    const result = await service.certifyPublicKey(pk);
    expect(true).toEqual(isBoolean(result));
  });

  it("Certify product's events", async () => {
    const event = await prisma.event.findFirst();
    const result = await service.certifyEvents(event.productId);

    expect(result[0].id).toEqual(expect.any(String));
    expect(result[0].certifiedBy).toEqual(expect.any(String));
    expect(true).toEqual(isBoolean(result[0].certified));
  });
});
