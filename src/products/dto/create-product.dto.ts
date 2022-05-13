import { Decimal } from '@prisma/client/runtime';
import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  published: boolean;

  @IsNumber()
  price: Decimal;

  @IsDate()
  warrantyExpiresOn: Date;
}
