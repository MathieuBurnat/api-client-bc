import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsKeypairValid', async: true })
@Injectable()

// This tag use an qrcode to check if it exist in the database
export class IsKeypairValid implements ValidatorConstraintInterface {
  async validate(keypair: any) {
    // Get certified entity
    const ce = await prisma.certifiedEntity.findUnique({
      where: {
        publicKey: keypair.publicKey,
      },
    });

    // If the entity doesnt exist, return false
    if (ce) {
      return true;
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The keypair is not valid. Is the public key known as a certified entity ?`;
  }
}
