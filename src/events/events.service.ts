import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import prisma from '../../lib/prisma';

@Injectable()
export class EventsService {
  async create(event, product) {
    const eventType = await this.getEventType(event.type);

    let createEventDto = new CreateEventDto();

    createEventDto = {
      ...createEventDto,
      content: event.content,
      productId: product.id,
      eventTypeId: eventType.id,
    };

    return prisma.event.create({
      data: {
        ...createEventDto,
      },
    });
  }

  async createEvent(createEventDto: CreateEventDto) {
    return prisma.event.create({
      data: {
        ...createEventDto,
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

  getEventType(eventType: string) {
    return prisma.eventType.findUnique({
      where: {
        content: eventType,
      },
    });
  }
}
