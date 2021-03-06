import { ProductStatus } from '@prisma/client';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';
import { IsKeypairValid, IsKeypairCertifedEntity } from '../../validations/certified-entity-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNotEmpty()
  status: ProductStatus;

  @Validate(IsKeypairValid)
  @Validate(IsKeypairCertifedEntity)
  @IsNotEmpty()
  keypair: any;
}
