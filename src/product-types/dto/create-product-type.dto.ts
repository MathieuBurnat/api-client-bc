import { IsNotEmpty } from 'class-validator';
export class CreateProductTypeDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  slug: string;
}
