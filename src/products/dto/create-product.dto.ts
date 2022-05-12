import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty } from 'class-validator';
export class CreateProductDto {
    @IsNotEmpty()
    name: string;
    published : boolean;
    price : Decimal;
}
