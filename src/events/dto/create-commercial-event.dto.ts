import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty } from 'class-validator';

export class CreateCommercialEventDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  eventTypeId: string;

  @IsNotEmpty()
  action: Decimal;

  @IsNotEmpty()
  shall_expire_on: Date;
}
