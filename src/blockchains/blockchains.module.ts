import { Module } from '@nestjs/common';
import { BlockchainsService } from './blockchains.service';
import { BlockchainsController } from './blockchains.controller';

@Module({
  controllers: [BlockchainsController],
  providers: [BlockchainsService]
})
export class BlockchainsModule {}
