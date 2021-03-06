import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductWarrantyDto } from './dto/update-product-warranty-dto';
import { UpdateClientRetriveProductDto } from './dto/update-client-retrive-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { UpdateProductQrcodeDto } from './dto/update-product-qrcode.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('/warranty/extend/')
  extendWarranty(@Body() updateProductWarrantyDto: UpdateProductWarrantyDto) {
    return this.productsService.extendWarranty(updateProductWarrantyDto);
  }

  @Post('/retrieve/')
  retrieve(
    @Body() updateClientRetriveProductDto: UpdateClientRetriveProductDto,
  ) {
    return this.productsService.retrieve(updateClientRetriveProductDto);
  }

  @Post('/qrcode/generate')
  generateQrcode(@Body() updateProductQrcodeDto: UpdateProductQrcodeDto) {
    return this.productsService.generateQrcode(updateProductQrcodeDto);
  }

  @Get('/status/')
  getStatus() {
    return this.productsService.getStatus();
  }

  @Post('/status/update/')
  updateStatus(@Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productsService.updateStatus(updateProductStatusDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('/events/:id')
  findOneGetEvents(@Param('id') id: string) {
    return this.productsService.findOneGetEvents(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
