import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductListener {
  //Handle and process on created
  @OnEvent('product.created')
  handleCreatedEvent(product) {
    console.log('A product has been created :)');
    console.log(product);
  }

  //Handle and process on retrieve
  @OnEvent('product.retrieve')
  handleRetrieveEvent(product) {
    console.log('A product has been retrieved by ' + product.ownerId);
    console.log(product);
  }

  //Handle and process on extendWarranty
  @OnEvent('product.warranty.extend')
  handleExtendWarrantyEvent(product) {
    console.log("A product's warranty has been extended");
    console.log(product);
  }
}
