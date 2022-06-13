import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import prisma from '../../lib/prisma';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateCommercialEventDto } from './dto/create-commercial-event.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Decimal } from '@prisma/client/runtime';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('EventsController', () => {
  let controller: EventsController;
  const eventsService = new EventsService(new EventEmitter2());

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
    const result = await eventsService.createEvent(createEventDto);

    expect(result.id).toEqual(eventGoal.id);
    expect(result.productId).toEqual(eventGoal.productId);
    expect(result.content).toEqual(eventGoal.content);
    expect(result.createdAt).toEqual(eventGoal.createdAt);
    expect(result.eventTypeId).toEqual(eventGoal.eventTypeId);
  });

  it('Event - Create a commercial event', async () => {
    let createCommercialEventDto = new CreateCommercialEventDto();
    const product = await prisma.product.findFirst();
    const eventType = await prisma.eventType.findFirst();

    createCommercialEventDto = {
      ...createCommercialEventDto,
      content: '[Unit Testing] This is a test',
      productId: product.id,
      eventTypeContent: eventType.content,
      action: new Decimal(20),
      shall_expire_on: new Date(),
    };

    // Create the commercial event
    const result = await eventsService.createCommercial(
      createCommercialEventDto,
    );

    expect(result.id).toEqual(eventGoal.id);
    expect(result.productId).toEqual(eventGoal.productId);
    expect(result.content).toEqual(eventGoal.content);
    expect(result.createdAt).toEqual(eventGoal.createdAt);
    expect(result.eventTypeId).toEqual(eventGoal.eventTypeId);
  });

  it('Get event - Find Many', async () => {
    const result = await eventsService.findAll();

    expect(result[0].id).toEqual(eventGoal.id);
    expect(result[0].content).toEqual(eventGoal.content);
    expect(result[0].productId).toEqual(eventGoal.productId);
  });

  it('Get event - Find one', async () => {
    const event = await prisma.event.findFirst();
    const result = await eventsService.findOne(event.id);

    expect(result.id).toEqual(eventGoal.id);
    expect(result.content).toEqual(eventGoal.content);
    expect(result.productId).toEqual(eventGoal.productId);
  });
});
