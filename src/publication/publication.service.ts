import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';
import { PublicationRepository } from './publication.repository';
import { Publication } from './entities/publication.entity';
import { messageUpdate } from '../user/entities/messageUpdate.entity';
import { FilterPublicationInput } from './dto/filter-publication.input';
import { DenouncePublication } from './dto/create-denounce.input';
import { PublicationOutput } from './entities/PublicationOutput';

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

  async update(updatePublicationInput: UpdatePublicationInput) {
    try {
      const publication = await this.publicationRepository.updatePublication(updatePublicationInput);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }



  async findAllForUserName( nameUser: string) {
    try {
      const publication = await this.publicationRepository.findAllForUserName(nameUser);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async createDenounce( id: number, denouncePublication:DenouncePublication) {
    try {
      const publication = await this.publicationRepository.denounceComment(id,denouncePublication);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async countDenounce( ) {
    try {
      const publication = await this.publicationRepository.countPublicationDenounce();
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  
  async findAllDenounce(skip?:number):Promise<PublicationOutput[]> {
    try {
      const publication = await this.publicationRepository.findAllPublicationDenounce(skip);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }



  async findAllForUserNameLike( nameUser: string) {
    try {
      const publication = await this.publicationRepository.findAllForUserNameLike(nameUser);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findAllForUserNameRecomendation( nameUser: string) {
    try {
      const publication = await this.publicationRepository.findAllForUserNameRecomendation(nameUser);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findAllForTypeProperty( typeProperty: string,filter?:FilterPublicationInput) {
    try {
      const publication = await this.publicationRepository.findAllForTypProperty(typeProperty,filter);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOne(id: number) {
    try {
      const publication = await this.publicationRepository.findOne(id);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }



  async removeOne(id: number): Promise<messageUpdate>{
    try {
      await this.publicationRepository.deleteOne(id);
      return {message:`Publicación ${id} eliminada`};
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  private handleDBerrors(error: any): never {
    //this.logger.error(error);
    console.log(error)
    throw new InternalServerErrorException('Por favor chequea los logs');
  }
}
