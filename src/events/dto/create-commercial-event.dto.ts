import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommercialEventDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  eventTypeContent: string;

  @IsNotEmpty()
  @IsNumber()
  action: Decimal;

  @IsNotEmpty()
  shall_expire_on: Date;
}
