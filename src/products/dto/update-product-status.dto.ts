import { Status } from '@prisma/client';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  keypair: any;
}
