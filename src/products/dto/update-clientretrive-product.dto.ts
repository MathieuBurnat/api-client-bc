import { IsNotEmpty } from 'class-validator';

export class UpdateClientRetriveProductDto {
  @IsNotEmpty()
  qrcode: string;

  @IsNotEmpty()
  ownerId: string;
}
