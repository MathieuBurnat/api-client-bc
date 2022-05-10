import { ClientsService } from './clients.service';
import { Injectable, Res, HttpStatus } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {

  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }

  retrieve(id: number, qrcode: string) {
    //return `This action retrieves the qrcode #${qrcode} for the client #${id}`;
    const message = `This action retrieves the qrcode #${qrcode} for the client #${id}`;
    return response.status(HttpStatus.BAD_REQUEST).send(message);
  }
}
