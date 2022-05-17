import { Type } from './../../../node_modules/event-target-shim/index.d';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { Ed25519Keypair, Transaction, Connection } from 'bigchaindb-driver';

@Injectable()
export class ProductListener {
  constructor(private readonly eventsService: EventsService) {}

  //Handle and process on created
  @OnEvent('product.created')
  handleCreatedEvent(product) {
    const event = {
      content: 'A product has been created',
      type: 'PRODUCT_CREATED',
    };
    this.pushEvent(event, product);
  }

  //Handle and process on retrieve
  @OnEvent('product.retrieve')
  handleRetrieveEvent(product) {
    const event = {
      content: 'A product has been retrieved by ' + product.ownerId,
      type: 'PRODUCT_RETRIEVED',
    };
    this.pushEvent(event, product);
  }

  //Handle and process on extendWarranty
  @OnEvent('product.warranty.extend')
  handleExtendWarrantyEvent(product) {
    const event = {
      content: "A product's warranty has been extended",
      type: 'PRODUCT_WARRANTY_EXTENDTED',
    };
    this.pushEvent(event, product);
  }

  //handle and process on product's status change
  @OnEvent('product.status.update')
  handleStatusChangeEvent(product) {
    const event = {
      content: "A product's status has been changed to " + product.status,
      type: product.status,
    };
    this.pushEvent(event, product);
  }

  //Push event to events service
  async pushEvent(event, product) {
    const eventOnDb = await this.saveDataOnDB(event, product);
    const eventOnBC = await this.saveDataOnBC(event, product);

    console.log('Data stored on database');
    console.log(eventOnDb);

    console.log('Data stored on the blockchain');
    console.log(eventOnBC);

    console.log('Get data within the blockchain');
    await this.getDataFromBC(product.id);
  }

  async saveDataOnDB(event, product) {
    const eventType = await this.eventsService.getEventType(event.type);

    let createEventDto = new CreateEventDto();

    createEventDto = {
      ...createEventDto,
      content: event.content,
      productId: product.id,
      eventTypeId: eventType.id,
    };

    return await this.eventsService.create(createEventDto);
  }

  async saveDataOnBC(event, product) {
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

    const txSigned = Transaction.signTransaction(tx, process.env.private_key);

    const conn = new Connection(process.env.API_PATH);

    return await conn
      .postTransactionCommit(txSigned)
      .then((retrievedTx) => retrievedTx);
  }

  async getDataFromBC(productId) {
    const conn = new Connection(process.env.API_PATH);

    return await conn
      .searchAssets(productId)
      .then((assets) => console.log('Found assets with product id :', assets));
  }
}
