import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';
import { BigchaindbAdapter } from '../blockchains/adapters/bigchain.adapter';

@ValidatorConstraint({ name: 'IsKeypairValid', async: true })
@Injectable()
// Verify if the keypair is valid (if the public key is the original public key of the private key) 
export class IsKeypairValid implements ValidatorConstraintInterface {
  async validate(keypair: any) {
    const ba = new BigchaindbAdapter();
    return ba.verifyKeypair(keypair);
  }

  defaultMessage(args: ValidationArguments) {
    return `The keypair is not valid. Are you sure than the public key is owned by the private key ?`;
  }
}

@ValidatorConstraint({ name: 'IsKeypairCertifedEntity', async: true })
@Injectable()
// Verify if the public key inside the keypair is kown by our system as a certified entity
export class IsKeypairCertifedEntity implements ValidatorConstraintInterface {
  async validate(keypair: any) {
    const ba = new BigchaindbAdapter();
    return ba.certifyPublicKey(keypair.publicKey);
  }

  defaultMessage(args: ValidationArguments) {
    return `The public key is not certify as a certified entity. It cannot be used to create a transaction.`;
  }
}
