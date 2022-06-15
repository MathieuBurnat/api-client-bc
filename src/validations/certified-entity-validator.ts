import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';
import { BigchaindbAdapter } from '../blockchains/adapters/bigchain.adapter';

@ValidatorConstraint({ name: 'IsKeypairValid', async: true })
@Injectable()

// This tag use an qrcode to check if it exist in the database
export class IsKeypairValid implements ValidatorConstraintInterface {
  async validate(keypair: any) {
    const ba = new BigchaindbAdapter();
    ba.verifyKeypair(keypair.publicKey);
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `The keypair is not valid. Are you sure than the keypair format is correct ?`;
  }
}
