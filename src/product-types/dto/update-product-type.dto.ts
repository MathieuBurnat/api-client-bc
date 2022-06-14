import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTypeDto } from './create-product-type.dto';

export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto) {}
