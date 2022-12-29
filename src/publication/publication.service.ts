import { Injectable } from '@nestjs/common';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';

@Injectable()
export class PublicationService {
  create(createPublicationInput: CreatePublicationInput) {
    return 'This action adds a new publication';
  }

  findAll() {
    return `This action returns all publication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationInput: UpdatePublicationInput) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
