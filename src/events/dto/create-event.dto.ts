import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    productId: string;

    @IsNotEmpty()
    eventTypeId: string;
}
