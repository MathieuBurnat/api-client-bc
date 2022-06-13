import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainsService } from './blockchains.service';

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
});
