import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductListener {
    //Handle and process on created
    @OnEvent('product.created')
    handleCreatedEvent(product) {
        console.log("A product has been created :)");
        console.log(product);
    }

    //Handle and process on retrieve
    @OnEvent('product.retrieve')
    handleRetrieveEvent(product) {
        // handle and process "OrderCreatedEvent" event
        console.log("A product has been retrieved by " + product.ownerId);
        console.log(product);
    }
}
