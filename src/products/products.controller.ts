import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductWarrantyDto } from './dto/UpdateProductWarrantyDto';
import { UpdateClientRetriveProductDto } from './dto/update-clientRetrive-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('warranty/extend/')
  extendWarranty(@Body() updateProductWarrantyDto: UpdateProductWarrantyDto) {
    return this.productsService.extendWarranty(updateProductWarrantyDto);
  }

  @Post('/retrieve/')
  retrieve(
    @Body() updateClientRetriveProductDto: UpdateClientRetriveProductDto,
  ) {
    return this.productsService.retrieve(updateClientRetriveProductDto);
  }

  @Post('/status/update/')
  updateStatus(@Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productsService.updateStatus(updateProductStatusDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
