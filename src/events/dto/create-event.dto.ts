import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  eventTypeId: string;

  @IsNotEmpty()
  certifiedBy: string;
}
