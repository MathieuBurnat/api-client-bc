import { Status } from '@prisma/client';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';
import { IsKeypairValid } from '../../validations/certified-entity-validator';

export class UpdateProductStatusDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNotEmpty()
  status: Status;

  @Validate(IsKeypairValid)
  @IsNotEmpty()
  keypair: any;
}
