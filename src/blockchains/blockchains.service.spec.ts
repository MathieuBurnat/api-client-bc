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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
