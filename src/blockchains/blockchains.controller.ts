import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockchainsService } from './blockchains.service';

@Controller('blockchains')
export class BlockchainsController {
  constructor(private readonly blockchainsService: BlockchainsService) {}
  @Get('/generate-keys')
  generateKeys() {
    return this.blockchainsService.generateKeys();
  }

  @Get('/assets/:id')
  getAssets(@Param('id') id: string) {
    return this.blockchainsService.getAssets(id);
  }

  @Get('/certify/events/:product_id')
  certifyEvents(@Param('product_id') productId: string) {
    return this.blockchainsService.certifyEvents(productId);
  }

  @Get('/certify/public-key/:id')
  certifyPublicKey(@Param('id') id: string) {
    return this.blockchainsService.certifyPublicKey(id);
  }

  @Get('/transactions/:id')
  getTransactions(@Param('id') id: string) {
    return this.blockchainsService.getTransactions(id);
  }
}
