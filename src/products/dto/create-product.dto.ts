import { Decimal } from '@prisma/client/runtime';
import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  published: boolean;

  @IsNotEmpty()
  qrcode: string;

  @IsNumber()
  price: Decimal;

  @IsDate()
  warrantyExpiresOn: Date;
}
