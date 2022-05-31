import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsQrcodeExist', async: true })
@Injectable()

// This tag use an qrcode to check if it exist in the database
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

@ValidatorConstraint({ name: 'IsQrcodeNotExist', async: true })
@Injectable()
// This tag use an product id to check if the qrcode doesn't exist in the database
// It's to avoid a qrcode to erase or replace an already existing qrcode
export class IsQrcodeNotExist implements ValidatorConstraintInterface {
  async validate(id: string) {
    // Get product
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    // If the qrcode doesn't exist, we can return true
    // This action could be used to generate a new qrcode
    if (product.qrcode == null) {
      return true;
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `We are sorry, this qrcode has already been generated`;
  }
}
