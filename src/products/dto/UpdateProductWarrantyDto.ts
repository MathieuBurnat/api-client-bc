import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductWarrantyDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  id: string;

  @IsNumber()
  delay: number;
}
