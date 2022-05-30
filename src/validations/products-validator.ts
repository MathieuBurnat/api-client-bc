import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsQrcodeExist', async: true })
@Injectable()
export class IsQrcodeExist implements ValidatorConstraintInterface {
  async validate(qrcode: string) {
    // Get product
    const product = await prisma.product.findUnique({
      where: {
        qrcode,
      },
    });

    // If the product doesnt exist, it means that the qrcode doesn't exist
    if (product) {
      return true;
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The qrcode doesn't exist`;
  }
}
