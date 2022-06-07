import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from '../events.service';
import { BlockchainsService } from '../../blockchains/blockchains.service';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class ProductListener {
  constructor(
    private readonly eventsService: EventsService,
    public blockchainsService: BlockchainsService,
  ) {}

  //Handle and process on created
  @OnEvent('product.created')
  async handleCreatedEvent(product) {
    const event = {
      content: 'A product has been created',
      type: 'PRODUCT_CREATED',
    };
    const e = await this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(e, product);
  }

  //Handle and process on retrieve
  @OnEvent('product.retrieve')
  async handleRetrieveEvent(product) {
    const event = {
      content: 'A product has been retrieved by ' + product.ownerId,
      type: 'PRODUCT_RETRIEVED',
    };
    const e = await this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(e, product);
  }

  //Handle and process on extendWarranty
  @OnEvent('product.warranty.extend')
  async handleExtendWarrantyEvent(product) {
    const event = {
      content: "A product's warranty has been extended",
      type: 'PRODUCT_WARRANTY_EXTENTED',
    };
    const e = await this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(e, product);
  }

  // Handle and process when the qrcode is generated
  @OnEvent('product.qrcode.generate')
  async handleQrcodeGenerateEvent(product) {
    const event = {
      content: "A product's qrcode has been generated",
      type: 'PRODUCT_QRCODE_GENERATED',
    };
    const e = await this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(e, product);
  }

  //handle and process on product's status change
  @OnEvent('product.status.update')
  async handleStatusChangeEvent(product) {
    const event = {
      content: "A product's status has been changed to " + product.status,
      type: product.status,
    };
    const e = await this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(e, product);
  }

  // Handle and process on commercial events
  @OnEvent('commercial.event')
  handleCommercialEvent(event, product) {
    this.saveEventOnBlockchain(event, product);
  }

  //save the event on the database
  async saveEventOnDataBase(event, product) {
    const eventType = await this.eventsService.getEventType(event.type);

    let createEventDto = new CreateEventDto();

    createEventDto = {
      ...createEventDto,
      content: event.content,
      productId: product.id,
      eventTypeId: eventType.id,
    };

    const eventOnDb = await this.eventsService.createEvent(createEventDto);

    console.log('\n\n[ Data stored on database ]');
    console.log(eventOnDb);
    return eventOnDb;
  }

  //save the event on the blockchain
  async saveEventOnBlockchain(event, product) {
    const eventOnBCPost = await this.blockchainsService.createTransaction(
      event,
      product,
    );

    const eventOnBcGet = await this.blockchainsService.getTransactions(
      product.id,
    );

    console.log('\n\n[ Data stored on the blockchain ]');
    console.log(eventOnBCPost);

    console.log('\n\n[ Get data within the blockchain ]');
    console.log(eventOnBcGet);
  }
}
