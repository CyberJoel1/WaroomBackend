import { Injectable } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { User } from 'src/user/entities/user.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';
import { Publication } from './entities/publication.entity';
import * as moment from 'moment'
@Injectable()
export class PublicationRepository {

  async deleteOne(id: number) {
    console.log(`MATCH (publication:Publication) WHERE id(publication) = ${id} DETACH DELETE publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication) WHERE id(publication) = ${id} DETACH DELETE publication`,
      )
      .run();
  }

  
  async findOne(id: number) {
    console.log(`MATCH (n:Publication ) WHERE id(n) = ${id} return n`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication) WHERE id(publication) = ${id} RETURN publication`,
      )
      .run();

      if (query?.length > 0) {
        const {
          publication: { identity, properties },
        } = query[0];
  
        return {
          id: identity,
          ...properties,
        };
      }
  }
  constructor(private readonly queryRepository: QueryRepository) {}
  async createPublication(
    createPublicationInput: CreatePublicationInput,
    user: User,
  ): Promise<Publication> {
    const {
      photos,
      tipo,
      banos,
      habitaciones,
      latitud,
      longitud,
      medida,
      message,
      titulo,
      activo,
    } = createPublicationInput;
    let photosString = `[`;
    photos.forEach((element, index) => {
      photosString += `"${element}"`;
      if (index < photos.length - 1) {
        photosString += `,`;
      }
    });
    photosString += `]`;
    let date = moment(new Date()).format('YYYY-MM-DD');
    console.log(`MATCH (user:User) WHERE id(user) = ${user.id}
    CREATE (publication:Publication {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
    banos: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
    ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"})
   CREATE (user)-[:PUBLICATED {date_created:date("${new Date().toLocaleDateString()}")}]->(publication)
   RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE id(user) = ${user.id}
         CREATE (publication:Publication {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
         banos: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
         ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"})
        CREATE (user)-[:PUBLICATED {date_created:"${date}"}]->(publication)
        RETURN publication`,
      )
      .run();

    if (query?.length > 0) {
      const {
        publication: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    }
  }

  async findAllForUserName(nameUser: string): Promise<Publication[]> {
    console.log(`MATCH (publication:Publication)<-[:PUBLICATED]-(user:User {userName: "${nameUser}"})
    RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication)<-[p:PUBLICATED]-(user:User {userName: "${nameUser}"})
        RETURN publication,p,user`,
      )
      .run();

    if (query?.length > 0) {
      const publications: Publication[] = [];

      for (const publicationx of query) {
        const {publication,p, user} = publicationx;

        let merged = {...publication.properties, ...p.properties,...{user:{...user.properties}}};

        publications.push({
          identity: publication.identity,
          ...merged,
        });
      }
      console.log(publications)
      return publications;
    }
  }


  async updatePublication(
    updatePublicationInput: UpdatePublicationInput
  ): Promise<Publication> {
    const {
      id,
      photos,
      tipo,
      banos,
      habitaciones,
      latitud,
      longitud,
      medida,
      message,
      titulo,
      activo,
    } = updatePublicationInput;
    let photosString = `[`;
    photos.forEach((element, index) => {
      photosString += `"${element}"`;
      if (index < photos.length - 1) {
        photosString += `,`;
      }
    });
    photosString += `]`;

    console.log(`MATCH (publication:Publication) WHERE id(publication) = ${id}
    SET {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
    banos: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
    ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"}
   RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication) WHERE id(publication) = ${id} 
        SET publication = {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud}, 
        banos: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}",
        photos:${photosString}, activo: ${activo}, tipo:"${tipo}"} RETURN publication`,
      )
      .run();

    if (query?.length > 0) {
      const {
        publication: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    }
  }


  
}
