import { BlockchainsService } from 'src/blockchains/blockchains.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductListener } from './events/listeners/product.listener';
import { EventsService } from './events/events.service';
import { ConfigModule } from '@nestjs/config';
import { BlockchainsModule } from './blockchains/blockchains.module';

@Module({
  imports: [
    ClientsModule,
    ProductsModule,
    EventsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    BlockchainsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductListener, BlockchainsService, EventsService],
})
export class AppModule {}
