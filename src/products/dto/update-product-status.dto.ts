import { ProductStatus } from '@prisma/client';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';
import { IsKeypairValid } from '../../validations/certified-entity-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNotEmpty()
  status: ProductStatus;

  @Validate(IsKeypairValid)
  @IsNotEmpty()
  keypair: any;
}
