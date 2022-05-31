import { IsNotEmpty } from 'class-validator';

export class UpdateProductQrcodeDto {
  @IsNotEmpty()
  id: string;
}
