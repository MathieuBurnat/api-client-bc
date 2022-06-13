import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';

export class CreateCommercialEventDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @Validate(IsProductExists)
  productId: string;

  @IsNotEmpty()
  eventTypeContent: string;

  @IsNotEmpty()
  @IsNumber()
  action: Decimal;

  @IsNotEmpty()
  shall_expire_on: Date;
}
