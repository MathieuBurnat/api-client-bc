import { IsNotEmpty } from 'class-validator';
import { IsQrcodeNotExist } from '../../validations/products-validator';
import { Validate } from 'class-validator';

export class UpdateProductQrcodeDto {
  @IsNotEmpty()
  @Validate(IsQrcodeNotExist)
  productId: string;
}
