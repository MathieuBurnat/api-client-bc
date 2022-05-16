import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductListener } from './events/listeners/product.listener';

@Module({
  imports: [ClientsModule, ProductsModule, EventsModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ProductListener],
})
export class AppModule {}
