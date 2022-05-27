import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  async validate(email: string) {
    // Get client
    const client = await prisma.client.findUnique({
      where: {
        email,
      },
    });

    // If the client exists, it means that the email is not unique
    if (client) {
      return false;
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The email is already used`;
  }
}
