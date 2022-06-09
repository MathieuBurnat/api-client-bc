import { IsNotEmpty } from 'class-validator';
import { Validate } from 'class-validator';
import { IsQrcodeExist } from '../../validations/products-validator';

export class UpdateClientRetriveProductDto {
  @IsNotEmpty()
  @Validate(IsQrcodeExist)
  qrcode: string;

  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  keypair: any;
}
