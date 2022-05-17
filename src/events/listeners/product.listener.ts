import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class ProductListener {
  constructor(private readonly eventsService: EventsService) {}

  //Handle and process on created
  @OnEvent('product.created')
  handleCreatedEvent(product) {
    const content = 'A product has been created';
    this.pushEvent(content, product);
  }

  //Handle and process on retrieve
  @OnEvent('product.retrieve')
  handleRetrieveEvent(product) {
    const content = 'A product has been retrieved by ' + product.ownerId;
    this.pushEvent(content, product);
  }

  //Handle and process on extendWarranty
  @OnEvent('product.warranty.extend')
  handleExtendWarrantyEvent(product) {
    const content = "A product's warranty has been extended";
    this.pushEvent(content, product);
  }

  //handle and process on product's status change
  @OnEvent('product.status.update')
  handleStatusChangeEvent(product) {
    const content = "A product's status has been changed to " + product.status;
    this.pushEvent(content, product);
  }

  //Push event to events service
  async pushEvent(content, product) {
    let createEventDto = new CreateEventDto();

    createEventDto = {
      ...createEventDto,
      content: content,
      productId: product.id,
      eventTypeId: 'cl39uax020018k4f19qbt4slf',
    };

    const event = await this.eventsService.create(createEventDto);
    console.log(event);
  }
}
