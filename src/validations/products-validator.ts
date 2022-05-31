import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsQrcodeExist', async: true })
@Injectable()

// This tag use an product id to check if the qrcode doesn't exist in the database
// It's to avoid a qrcode to erase or replace an already existing qrcode
class IsQrcodeNotExist implements ValidatorConstraintInterface {
  async validate(productId: string) {
    return false;
    // Get product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // If the qrcode doesn't exist, we can return true
    // This action could be used to generate a new qrcode
    if (product.qrcode == null) {
      return true;
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `We are sorry, this qrcode has already been generated`;
  }
}

export { IsQrcodeNotExist };
