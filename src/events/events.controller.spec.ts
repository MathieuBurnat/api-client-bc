import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import prisma from '../../lib/prisma';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('EventsController', () => {
  let controller: EventsController;

  const eventGoal = {
    id: expect.any(String),
    productId: expect.any(String),
    eventTypeId: expect.any(String),
    content: expect.any(String),
    createdAt: expect.any(Date),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('Event - Create a event', async () => {
    let createEventDto = new CreateEventDto();
    const product = await prisma.product.findFirst();
    const eventType = await prisma.eventType.findFirst();

    createEventDto = {
      ...createEventDto,
      content: '[Unit Testing] This is a test',
      productId: product.id,
      eventTypeId: eventType.id,
    };

    // Create the event
    const result = await prisma.event.create({
      data: {
        ...createEventDto,
      },
    });

    expect(result.id).toEqual(eventGoal.id);
    expect(result.productId).toEqual(eventGoal.productId);
    expect(result.content).toEqual(eventGoal.content);
    expect(result.createdAt).toEqual(eventGoal.createdAt);
    expect(result.eventTypeId).toEqual(eventGoal.eventTypeId);
  });

  it('Get event - Find Many', async () => {
    const result = await prisma.event.findMany();

    expect(result[0].id).toEqual(eventGoal.id);
    expect(result[0].content).toEqual(eventGoal.content);
    expect(result[0].productId).toEqual(eventGoal.productId);
  });

  it('Get event - Find one', async () => {
    const result = await prisma.event.findFirst();

    expect(result.id).toEqual(eventGoal.id);
    expect(result.content).toEqual(eventGoal.content);
    expect(result.productId).toEqual(eventGoal.productId);
  });
});
