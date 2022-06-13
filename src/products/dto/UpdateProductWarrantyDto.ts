import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsProductExists } from '../../validations/products-validator';

export class UpdateProductWarrantyDto {
  @IsNotEmpty()
  @Validate(IsProductExists)
  id: string;

  @IsNumber()
  delay: number;

  @IsNotEmpty()
  keypair: any;
}
