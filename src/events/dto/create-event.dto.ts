import { isDate, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    content: string;
    productId: string;
    eventTypeId: string;
}
