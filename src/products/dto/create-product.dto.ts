import { Decimal } from '@prisma/client/runtime';
import { isDate, IsNotEmpty, IsNumber, IsDate, Validate } from 'class-validator';
import { IsKeypairValid } from '../../validations/certified-entity-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  published: boolean;

  @IsNotEmpty()
  warrantyExpiresOn: Date;

  @IsNumber()
  price: Decimal;

  @Validate(IsKeypairValid)
  @IsNotEmpty()
  keypair: any;
}
