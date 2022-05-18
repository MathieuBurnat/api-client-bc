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
    const eventOnBCPost = await this.blockchainsService.createTransaction(
      event,
      product,
    );

    const eventOnBcGet = await this.blockchainsService.getTransactions(
      product.id,
    );

    console.log('\n\n[ Data stored on database ]');
    console.log(eventOnDb);

    console.log('\n\n[ Data stored on the blockchain ]');
    console.log(eventOnBCPost);

    console.log('\n\n[ Get data within the blockchain ]');
    console.log(eventOnBcGet);
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
}
