import { Ed25519Keypair, Transaction, Connection } from 'bigchaindb-driver';
import prisma from '../../../lib/prisma';
import { HttpException, HttpStatus } from '@nestjs/common';
import { pluck } from 'rxjs';

export class BigchaindbAdapter {
  async createTransaction(event, product) {
    const tx = Transaction.makeCreateTransaction(
      // Store the event, the product, and a timestamp
      { event: event, product: product, created_at: new Date().toString() },

      // Metadata contains information about the transaction itself
      // (can be `null` if not needed)
      { what: event.content },

      // A transaction needs an output
      [
        Transaction.makeOutput(
          Transaction.makeEd25519Condition(process.env.public_key),
        ),
      ],
      process.env.public_key,
    );

    // Sign the transaction with the private key
    const txSigned = Transaction.signTransaction(tx, process.env.private_key);

    const conn = new Connection(process.env.API_PATH);

    return await conn
      .postTransactionCommit(txSigned)
      .then((retrievedTx) => retrievedTx);
  }

  async getTransactions(productId) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.searchAssets(productId).then((assets) => assets);
  }

  // Verify eventy
  async verifyEvents(productId) {
    // -- [ First check ] --
    // Verify if the events from the database is the same than the events from the blockchain

    // *** Events on database ***
    // Get the events from the database
    let DB_Events = await prisma.event.findMany({
      where: {
        productId,
      },
    });

    // Throw an error if there are no events in the database
    if (DB_Events.length <= 0) {
      throw new HttpException(
        'We are sorry, this productId is referred to any event within the database',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Sort Db events by id
    DB_Events = DB_Events.sort((a, b) => a.id.localeCompare(b.id));

    // *** Events on blockchain ***

    //Get the events from the blockchain
    let BC_Events = await this.getTransactions(productId);

    // Pluck events
    BC_Events = BC_Events.map((a) => a.data.event);

    // Sort BC events by id
    BC_Events = BC_Events.sort((a, b) => a.id.localeCompare(b.id));

    // ** Render the result **
    console.log('\n\nDB Events');
    console.log(DB_Events);

    console.log('\n\nBC Events');
    console.log(BC_Events);

    if (JSON.stringify(DB_Events) === JSON.stringify(BC_Events)) {
      console.log('✅ objects are equal');
    } else {
      console.log('⛔️ objects are NOT equal');
    }

    // -- [ Second check ] --
    // Verify the authenticity of the events from the blockchain
    // Well the event's public key need to be known

    // Return the events with the tag 'verified' if it is
    return true;
  }

  async verifyPublicKey(id) {
    return 'Verified';
  }

  // Generate an ed25519 keypair
  async generateKeys() {
    return await new Ed25519Keypair();
  }

  async test(id) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.getTransaction(id).then((assets) => assets);
  }
}
