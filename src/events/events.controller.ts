import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { get } from 'http';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/create')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('/types')
  findAllTypes() {
    return this.eventsService.findAllTypes();
  }

  @Get('/types/:id')
  findOneTypes(@Param('id') id: string) {
    return this.eventsService.findOneTypes(id);
  }

  @Get('/commercials')
  findAllCommercials() {
    return this.eventsService.findAllCommercials();
  }

  @Get('/commercials/:id')
  findOneCommercials(@Param('id') id: string) {
    return this.eventsService.findOneCommercials(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
