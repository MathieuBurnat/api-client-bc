import { Decimal } from '@prisma/client/runtime';
import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  published: boolean;

  @IsNotEmpty()
  warrantyExpiresOn: Date;

  @IsNumber()
  price: Decimal;

  @IsNotEmpty()
  keypair: any;
}
