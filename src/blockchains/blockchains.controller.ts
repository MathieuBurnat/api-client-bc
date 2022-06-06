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
}
