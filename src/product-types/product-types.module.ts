import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';

@Module({
  controllers: [ProductTypesController],
  providers: [ProductTypesService]
})
export class ProductTypesModule {}
