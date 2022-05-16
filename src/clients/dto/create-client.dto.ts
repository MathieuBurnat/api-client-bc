import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}
