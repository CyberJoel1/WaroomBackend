import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';
import { PublicationRepository } from './publication.repository';

@Injectable()
export class PublicationService {

  constructor(private readonly publicationRepository: PublicationRepository) {}

  async create(createPublicationInput: CreatePublicationInput, user: User) {
    try {
      const publication = await this.publicationRepository.createPublication(createPublicationInput, user);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
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

  private handleDBerrors(error: any): never {
    //this.logger.error(error);
    console.log(error)
    throw new InternalServerErrorException('Por favor chequea los logs');
  }
}
