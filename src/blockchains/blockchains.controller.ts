import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockchainsService } from './blockchains.service';

@Controller('blockchains')
export class BlockchainsController {
  constructor(private readonly blockchainsService: BlockchainsService) {}
  @Get('/generate-keys')
  generateKeys() {
    return this.blockchainsService.generateKeys();
  }

  @Get('transactions/:id')
  findAll(@Param('id') id: string) {
    return this.blockchainsService.getTransactions(id);
  }

  @Get('/verify/events/:product_id')
  verifyEvents(@Param('product_id') productId: string) {
    return this.blockchainsService.verifyEvents(productId);
  }

  @Get('/verify/public_key/:id')
  verifyPublicKey(@Param('id') id: string) {
    return this.blockchainsService.verifyPublicKey(id);
  }

  @Get('/test/:id')
  test(@Param('id') id: string) {
    return this.blockchainsService.test(id);
  }
}
