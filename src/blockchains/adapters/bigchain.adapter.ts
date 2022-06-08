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

  // Get asset of a product id or an event id
  async getAssets(id) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.searchAssets(id).then((assets) => assets);
  }

  // Verify eventy
  async verifyEvents(productId) {
    // -- [ First check ] --
    // Verify if the events from the database is the same than the events from the blockchain

    // *** Events on database ***
    const DB_Events = await getPrettyDbEvents(productId);

    // *** Events on blockchain ***
    const BC_Events = await getPrettyBcEvents(await this.getAssets(productId));

    // ** Render the result **
    console.log('\n\nDB Events');
    console.log(DB_Events);

    console.log('\n\nBC Events');
    console.log(BC_Events);

    const certifiedEvents = [];
    if (JSON.stringify(DB_Events) === JSON.stringify(BC_Events)) {
      console.log('✅ objects are equal');

      let event;
      for (let i = 0; i < BC_Events.length; i++) {
        const asset = await this.getAssets(BC_Events[i].id);
        console.log('\n\nAsset: ', asset);
        const transaction = await this.getTransactions(asset[0].id);
        console.log('\n\ntransaction: ', transaction);

        // -- [ Second check ] --
        // Verify the authenticity of the events from the blockchain
        // Well the event's public key need to be known

        // Return the events with the tag 'verified' if it is
        // If the public key of the event if certified, set the tag certified to true
        if (CertifyPublicKey(transaction.outputs[0].public_keys[0])) {
          event = {
            ...BC_Events[i],
            certified: true,
          };
        } else {
          event = {
            ...BC_Events[i],
            certified: false,
          };
        }
        certifiedEvents.push(event);
      }
    } else {
      console.log('⛔️ objects are NOT equal');
    }

    return certifiedEvents;
  }

  async verifyPublicKey(id) {
    return 'Verified';
  }

  // Generate an ed25519 keypair
  async generateKeys() {
    return await new Ed25519Keypair();
  }

  async getTransactions(id) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.getTransaction(id).then((assets) => assets);
  }
}

// Certify the public key
// Return true if the public key is certified
async function CertifyPublicKey(publicKey) {
  if (publicKey == process.env.public_key) {
    return true;
  } else {
    return false;
  }
}

// Return the product's events within the database sorted by id
async function getPrettyDbEvents(productId) {
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
  return DB_Events;
}

//Return the product's events on the blockchain sorted by id
async function getPrettyBcEvents(BC_Events) {
  // Pluck events
  BC_Events = BC_Events.map((a) => a.data.event);

  // Sort BC events by id
  BC_Events = BC_Events.sort((a, b) => a.id.localeCompare(b.id));

  return BC_Events;
}
