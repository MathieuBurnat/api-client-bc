import { Decimal } from '@prisma/client/runtime';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateProductDto {
    @IsNotEmpty()
    name: string;
    published : boolean;

    @IsNumber()
    price : Decimal;
}
