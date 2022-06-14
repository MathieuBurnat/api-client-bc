import prisma from '../../lib/prisma';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';
import { Ed25519Keypair, Transaction, Connection } from 'bigchaindb-driver';

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
    if (!ce) {
      return false;
    }
    // Create and sign a transaction whitout publishing to the blockchain
    // This is to test if the keypair is valid
    let txSigned;
    try {
      const tx = Transaction.makeCreateTransaction(
        { event: 'this is a test, it won\t be published to the bc' },
        { what: 'validator test' },
        [
          Transaction.makeOutput(
            Transaction.makeEd25519Condition(keypair.publicKey),
          ),
        ],
        keypair.publicKey,
      );
      // Sign the transaction
      txSigned = Transaction.signTransaction(tx, keypair.privateKey);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `The keypair is not valid. Is the public key known as a certified entity ? Are you sure than the keypair format is correct ?`;
  }
}
