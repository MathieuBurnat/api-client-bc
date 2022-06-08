import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import prisma from '../../lib/prisma';
import { CreateCommercialEventDto } from './dto/create-commercial-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  // Create an event with CreateEventDto
  async createEvent(createEventDto: CreateEventDto) {
    return prisma.event.create({
      data: {
        ...createEventDto,
      },
      include: {
        eventType: true,
      },
    });
  }

  findAll() {
    return prisma.event.findMany();
  }

  findOne(id: string) {
    //find one event by id
    return prisma.event.findUnique({
      where: {
        id: id,
      },
    });
  }

  findAllType() {
    return prisma.eventType.findMany();
  }

  findOneTypes(id: string) {
    return prisma.eventType.findUnique({
      where: {
        id: id,
      },
    });
  }

  // Create an commercial event
  async createCommercial(createCommercialEventDto: CreateCommercialEventDto) {
    // Get the eventId
    const eventType = await this.getEventType(
      createCommercialEventDto.eventTypeContent,
    );

    // Create the commercial event
    const commercialEvent = await prisma.eventCommercial.create({
      data: {
        action: createCommercialEventDto.action,
        shall_expire_on: createCommercialEventDto.shall_expire_on,
      },
    });

    // Create the event and attach the commercial event id
    const event = await prisma.event.create({
      data: {
        content: createCommercialEventDto.content,
        productId: createCommercialEventDto.productId,
        eventTypeId: eventType.id,
        eventCommercialId: commercialEvent.id,
      },
    });

    const product = await prisma.product.findUnique({
      where: {
        id: createCommercialEventDto.productId,
      },
    });

    // For the bloclchain : create an event with the commercial event within
    const eventWithCommercial = {
      ...event,
      eventCommercial: commercialEvent,
    };

    this.eventEmitter.emit('commercial.event', eventWithCommercial, product);

    // Return the event
    return event;
  }

  findAllCommercial() {
    return prisma.eventCommercial.findMany();
  }

  findOneCommercials(id: string) {
    return prisma.eventCommercial.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getEventType(eventType: string) {
    return await prisma.eventType.findUnique({
      where: {
        content: eventType,
      },
    });
  }
}
