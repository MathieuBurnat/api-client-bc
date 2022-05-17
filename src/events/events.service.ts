import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import prisma from '../../lib/prisma';

@Injectable()
export class EventsService {
  create(createEventDto: CreateEventDto) {
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

  findAllTypes() {
    return prisma.eventType.findMany();
  }

  findOneTypes(id: string) {
    return prisma.eventType.findUnique({
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
