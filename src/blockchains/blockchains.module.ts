import { Module } from '@nestjs/common';
import { BlockchainsService } from './blockchains.service';
import { BlockchainsController } from './blockchains.controller';
//import { BigchaindbAdapter } from './adapters/bigchain.adapter';

@Module({
  controllers: [BlockchainsController],
  providers: [BlockchainsService],
})
export class BlockchainsModule {}
