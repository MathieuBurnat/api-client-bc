import { Ed25519Keypair, Transaction, Connection } from 'bigchaindb-driver';
import prisma from '../../../lib/prisma';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as ed from '@noble/ed25519';
import { encode, decode } from 'bs58';

export class BigchaindbAdapter {
  async createTransaction(event, product, keypair) {
    // USELESS this.verifyKeypair(keypair);

    const tx = Transaction.makeCreateTransaction(
      // Store the event, the product, and a timestamp
      { event: event, product: product, created_at: new Date().toString() },

      // Metadata contains information about the transaction itself
      // (can be `null` if not needed)
      { what: event.content },

      // A transaction needs an output
      [
        Transaction.makeOutput(
          Transaction.makeEd25519Condition(keypair.publicKey),
        ),
      ],
      keypair.publicKey,
    );

    // Create a connection to the BigchainDB API
    const conn = new Connection(process.env.API_PATH);

    // Try to sign the transaction and publish it
    let txSigned;
    try {
      // Sign the transaction
      txSigned = Transaction.signTransaction(tx, keypair.privateKey);
      // Post the transaction to the BigchainDB API
      return await conn
        .postTransactionCommit(txSigned)
        .then((retrievedTx) => retrievedTx);
    } catch (error) {
      console.log(error);
      console.log('Are you sure that the private key is valid ?');
    }
  }

  // Get asset of a product id or an event id
  async getAssets(id) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.searchAssets(id).then((assets) => assets);
  }

  // certify eventy
  async certifyEvents(productId) {
    // -- [ First check ] --
    // certify if the events from the database is the same than the events from the blockchain

    // *** Events on database ***
    const DB_Events = await this.getPrettyDbEvents(productId);

    // *** Events on blockchain ***
    const BC_Events = await this.getPrettyBcEvents(
      await this.getAssets(productId),
    );

    // ** Render the result **
    console.log('\n\nDB Events');
    console.log(DB_Events);

    console.log('\n\nBC Events');
    console.log(BC_Events);

    const certifiedEvents = [];
    let event;
    if (JSON.stringify(DB_Events) === JSON.stringify(BC_Events)) {
      console.log('✅ objects are equal');

      for (let i = 0; i < BC_Events.length; i++) {
        const asset = await this.getAssets(BC_Events[i].id);
        const transaction = await this.getTransactions(asset[0].id);

        // -- [ Second check ] --
        // certify the authenticity of the events from the blockchain
        // Well the event's public key need to be known

        // Return the events with the tag 'verified' if it is
        // If the public key of the event if certified, set the tag certified to true
        if (this.certifyPublicKey(transaction.outputs[0].public_keys[0])) {
          event = {
            ...BC_Events[i],
            certified: true,
          };
          console.log(
            '✅ Event ' +
              event.id +
              ' is certified by ' +
              transaction.outputs[0].public_keys[0],
          );
        } else {
          event = {
            ...BC_Events[i],
            certified: false,
          };
          console.log('⛔️ Event ' + event.id + ' is not certified');
        }
        certifiedEvents.push(event);
      }
    } else {
      DB_Events.forEach((e) => {
        event = {
          ...e,
          certified: false,
        };
        certifiedEvents.push(event);
      });
      console.log('⛔️ objects are NOT equal');
    }

    return certifiedEvents;
  }

  // Generate an ed25519 keypair
  async generateKeys() {
    // Generate random private key
    const privateKey = ed.utils.randomPrivateKey();

    // Get the public key referred to the private key
    const publicKey = await ed.getPublicKey(privateKey);

    // Create the keypair by encoding it
    // Encode rule : Uint8Array -> base58
    const encodedKeypair = {
      publicKey: 'BkXe7ZfB3PELLyFetNCCM5xjUKdw32tzSdTu3YbKYDNJ',
      privateKey: encode(privateKey),
    };

    // encodedKeypair Output :
    // {
    //   publicKey: 'FwYyR4DUwC3SqQJYiKdLak2sAi5CVxM4o52cyYe3K5hn',
    //   privateKey: '3vgi6qfxEucZrmCKEqcQ86C25mwiLEoz26HMajwcRjcd'
    // }

    // Verify if the encoded keypair is valid
    console.log(await this.verifyKeypair(encodedKeypair));
    // => true

    // Try to push the transaction
    // If it works well the encoding method is correct
    const event = { content: 'Im in' };
    const product = 'my product';

    return this.createTransaction(event, product, encodedKeypair);
    // 201 Ahaha win !
  }

  async getTransactions(id) {
    const conn = new Connection(process.env.API_PATH);

    return await conn.getTransaction(id).then((assets) => assets);
  }

  // Certify the public key
  // Return true if the public key is certified
  async certifyPublicKey(publicKey) {
    const certifiEntity = await prisma.certifiedEntity.findMany();
    // If certifyEntity countain the public key, return true
    if (certifiEntity.find((e) => e.publicKey === publicKey)) {
      return true;
    } else {
      return false;
    }
  }

  // Return the product's events within the database sorted by id
  async getPrettyDbEvents(productId) {
    // Get the events from the database
    let DB_Events = await prisma.event.findMany({
      where: {
        productId,
      },
      include: {
        eventType: true,
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
  async getPrettyBcEvents(BC_Events) {
    // Pluck events
    BC_Events = BC_Events.map((a) => a.data.event);

    // Sort BC events by id
    BC_Events = BC_Events.sort((a, b) => a.id.localeCompare(b.id));

    return BC_Events;
  }

  // Verify the keypair
  async verifyKeypair(keypair) {
    // Not valid if the keypair doesn't contain a publicKey and a privateKey
    if (!keypair.publicKey || !keypair.privateKey) {
      console.log(
        'We are sorry, this keypair is not valid. It must contains a publicKey and a privateKey',
      );
      return false;
    }

    console.log('\n\n -- [ Verify keypair ] --');
    // Verify if the encoded keypair is valid
    // Decode rule : base58 -> Uint8Array
    const decodedKeypair = {
      publicKey: decode(keypair.publicKey),
      privateKey: decode(keypair.privateKey),
    };

    console.log('\n default Keypair');
    console.log(keypair);
    console.log('\n decoded Keypair');
    console.log(decodedKeypair);

    // Verify the publickey
    // Extract the public key from the private key
    // if the extracted public key is not the same than the public key in the keypair, the keypair is not valid !
    const exrtactedPublickey = await ed.getPublicKey(decodedKeypair.privateKey);
    console.log('\n extractedPublickey');
    console.log(exrtactedPublickey);

    if (Buffer.compare(decodedKeypair.publicKey, exrtactedPublickey) !== 0) {
      console.log('The public key does not belong to the private key');
      return false;
    }
    return true;
  }
}
