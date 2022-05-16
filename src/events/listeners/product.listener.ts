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

