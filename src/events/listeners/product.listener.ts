import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { BlockchainsService } from 'src/blockchains/blockchains.service';

@Injectable()
export class ProductListener {
  constructor(
    private readonly eventsService: EventsService,
    public blockchainsService: BlockchainsService,
  ) {}

  //Handle and process on created
  @OnEvent('product.created')
  handleCreatedEvent(product) {
    const event = {
      content: 'A product has been created',
      type: 'PRODUCT_CREATED',
    };
    this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(event, product);
  }

  //Handle and process on retrieve
  @OnEvent('product.retrieve')
  handleRetrieveEvent(product) {
    const event = {
      content: 'A product has been retrieved by ' + product.ownerId,
      type: 'PRODUCT_RETRIEVED',
    };
    this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(event, product);
  }

  //Handle and process on extendWarranty
  @OnEvent('product.warranty.extend')
  handleExtendWarrantyEvent(product) {
    const event = {
      content: "A product's warranty has been extended",
      type: 'PRODUCT_WARRANTY_EXTENDTED',
    };
    this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(event, product);
  }

  //handle and process on product's status change
  @OnEvent('product.status.update')
  handleStatusChangeEvent(product) {
    const event = {
      content: "A product's status has been changed to " + product.status,
      type: product.status,
    };
    this.saveEventOnDataBase(event, product);
    this.saveEventOnBlockchain(event, product);
  }

  @OnEvent('commercial.event')
  handleCommercialEvent(event, product) {
    this.saveEventOnBlockchain(event, product);
  }

  //save the event on the database
  async saveEventOnDataBase(event, product) {
    const eventOnDb = await this.eventsService.create(event, product);

    console.log('\n\n[ Data stored on database ]');
    console.log(eventOnDb);
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
