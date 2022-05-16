import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
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
    });  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
