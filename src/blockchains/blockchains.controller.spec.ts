import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainsController } from './blockchains.controller';
import { BlockchainsService } from './blockchains.service';

describe('BlockchainsController', () => {
  let controller: BlockchainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainsController],
      providers: [BlockchainsService],
    }).compile();

    controller = module.get<BlockchainsController>(BlockchainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
