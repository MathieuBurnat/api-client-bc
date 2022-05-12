import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import prisma from '../../lib/prisma';
@Injectable()
export class ClientsService {
  create(createClientDto: CreateClientDto) {
    // create a new client with prisma
    return prisma.client.create({
      data: {
        ...createClientDto,
      },
    });
  }

  findAll() {
    return prisma.client.findMany();
  }

  findOne(id: string) {
    //find one client by id
    return prisma.client.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }

  retrieve(id: string, qrcode: string) {
    return `This action retrieves the qrcode #${qrcode} for the client #${id}`;
  }
}
