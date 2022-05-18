import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockchainsService } from './blockchains.service';

@Controller('blockchains')
export class ClientsController {
  constructor(private readonly blockchainsService: BlockchainsService) {}
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.blockchainsService.getTransactions(id);
  }
}
