import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsEmailUnique } from '../../validations/clients-validator';
import { Validate } from 'class-validator';

export class CreateClientDto {
  @IsEmail()
  @Validate(IsEmailUnique)
  email: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}
