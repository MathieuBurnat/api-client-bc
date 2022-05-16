import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ClientsModule, ProductsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
