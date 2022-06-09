import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductWarrantyDto {
  @IsNotEmpty()
  id: string;

  @IsNumber()
  delay: number;

  @IsNotEmpty()
  keypair: any;
}
