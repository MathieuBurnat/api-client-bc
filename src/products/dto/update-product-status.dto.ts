import { Status } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  keypair: any;
}
