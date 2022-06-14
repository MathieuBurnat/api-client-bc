import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';
import { IsKeypairValid } from '../../validations/certified-entity-validator';

export class UpdateProductWarrantyDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNumber()
  delay: number;

  @Validate(IsKeypairValid)
  @IsNotEmpty()
  keypair: any;
}
