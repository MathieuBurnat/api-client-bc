import { IsNotEmpty } from 'class-validator';
import { IsQrcodeNotExist } from '../../validations/products-validator';
import { Validate } from 'class-validator';
import { IsKeypairValid, IsKeypairCertifedEntity } from '../../validations/certified-entity-validator';

export class UpdateProductQrcodeDto {
  @IsNotEmpty()
  @Validate(IsQrcodeNotExist)
  id: string;

  @IsNotEmpty()
  @Validate(IsKeypairValid)
  @Validate(IsKeypairCertifedEntity)
  keypair: any;
}
