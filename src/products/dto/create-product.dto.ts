import { Decimal } from '@prisma/client/runtime';
import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  published: boolean;

  @IsNotEmpty()
  qrcode: string;

  @IsNotEmpty()
  warrantyExpiresOn: Date;

  @IsNumber()
  price: Decimal;
}
