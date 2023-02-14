import { Injectable } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { User } from 'src/user/entities/user.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';
import { Publication } from './entities/publication.entity';
import * as moment from 'moment';
import { TransformFilter } from './utils/publication.transformFilter';

import { FilterPublicationInput } from './dto/filter-publication.input';
import { FilterPublicationsService } from 'src/utils/filter-publications/filter-publications.service';
import { DenounceComment } from 'src/comment/entities/denounce.entity';
import { DenouncePublication } from './dto/create-denounce.input';
import { PublicationOutput } from './entities/PublicationOutput';

const { filterAll } = TransformFilter;
@Injectable()
export class PublicationRepository {
  constructor(
    private readonly queryRepository: QueryRepository,
    private readonly filterPublication: FilterPublicationsService,
  ) {}
  

  async denounceComment(id: number, denouncePublication: DenouncePublication) {
    const { foto,userName,idPublication,comment} = denouncePublication;
    console.log(`
        MATCH (user:User) WHERE id(user) = ${id} 
              (user2:User) WHERE user2.userName = "${userName}"
           CREATE (user)-[p:DENOUNCEPUBLICATION {identification: ${idPublication}, foto:${foto}}]->(user2)
           RETURN p`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `
        MATCH (user:User) WHERE id(user) = ${id} 
        MATCH (user2:User) WHERE user2.userName = "${userName}"
           CREATE (user)-[p:DENOUNCEPUBLICATION {identification: ${idPublication}, foto:"${foto}", comment:"${comment}"}]->(user2)
           RETURN p`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async findAllPublicationDenounce(skip?:number): Promise<PublicationOutput[]> {
    const skipCount = skip ?? 0;
    console.log(`MATCH (user1:User)-[denounce:DENOUNCEPUBLICATION]->(user2:User) RETURN user1,user2,denounce  
    ORDER BY id(denounce) SKIP ${skipCount} LIMIT 10`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User)-[denounce:DENOUNCEPUBLICATION]->(user2:User) RETURN user1,user2,denounce  
        ORDER BY id(denounce) SKIP ${skipCount} LIMIT 10`,
      )
      .run();

      if (query?.length > 0) {
        const denounces: PublicationOutput[] = [];
        
        for (const publicationx of query) {
          const { user1, user2, denounce } = publicationx;
          
  
          denounces.push({
            idPublication: denounce.identity,
            user1:{ id:user1.identity, ...user1.properties},
            user2:{ id:user2.identity, ...user2.properties},
            foto: denounce.properties.foto
          });
        }
        
        return denounces;
      }else{
        const denounces: any[] = [];
        return denounces;
      }
  }

  async deleteDenouncePublication(idDenouncePublication: number) {
    console.log(`MATCH ()-[denounce:DENOUNCEPUBLICATION]->()
    WHERE id(denounce) = ${idDenouncePublication} DETACH DELETE denounce`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[denounce:DENOUNCEPUBLICATION]->()
        WHERE id(denounce) = ${idDenouncePublication} DETACH DELETE denounce`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async deleteDenouncesByUsername(userName:string): Promise<Boolean> {
    console.log(`MATCH ()-[denounce:DENOUNCEPUBLICATION]->(user:User WHERE user.userName="${userName}") 
    DETACH DELETE denounce`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[denounce:DENOUNCEPUBLICATION]->(user:User WHERE user.userName="${userName}") 
        DETACH DELETE denounce`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async countPublicationDenounce(): Promise<number> {
    console.log(`MATCH p=()-[:DENOUNCEPUBLICATION]->() RETURN count(p) as max`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH p=()-[:DENOUNCEPUBLICATION]->() RETURN count(p) as max`,
      )
      .run();

      if (query?.length > 0) {
       const {max} = query[0];
       return parseInt(max);
      }else{
        return 0;
      }
  }


  async deleteOne(id: number) {
    console.log(
      `MATCH (publication:Publication) WHERE id(publication) = ${id} DETACH DELETE publication`,
    );
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
   CREATE (user)-[:PUBLICATED {date_created:date("${date}")}]->(publication)
   RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE id(user) = ${user.id}
         CREATE (publication:Publication {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
         banos: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
         ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"})
        CREATE (user)-[:PUBLICATED {date_created:date("${date}")}]->(publication)
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
        const { publication, p, user } = publicationx;

        const { year, month, day, hour, minute, second, nanosecond } =
          p.properties.date_created;
        const dataTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
          parseInt(day),
        );
        let dateFinal = moment(dataTime).format('YYYY-MM-DD');
        let merged = {
          ...publication.properties,
          ...p.properties,
          date_created: dateFinal,
          ...{ user: { ...user.properties } },
        };

        publications.push({
          identity: publication.identity,
          ...merged,
        });
      }
      
      return publications;
    }
  }

  async findAllForUserNameLike(nameUser: string): Promise<Publication[]> {
    console.log(`MATCH (publication:Publication)<-[:LIKED]-(user:User {userName: "${nameUser}"})
    RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User)-[p:PUBLICATED]->(publication:Publication)<-[:LIKED]-(user2:User {userName: "${nameUser}"}) WHERE user.userName<>"${nameUser}"
        RETURN publication,p,user`,
      )
      .run();

    if (query?.length > 0) {
      const publications: Publication[] = [];

      for (const publicationx of query) {
        const { publication, p, user } = publicationx;

        const { year, month, day, hour, minute, second, nanosecond } =
          p.properties.date_created;
        const dataTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
          parseInt(day),
        );
        let dateFinal = moment(dataTime).format('YYYY-MM-DD');
        let merged = {
          ...publication.properties,
          ...p.properties,
          date_created: dateFinal,
          ...{ user: { ...user.properties } },
        };

        publications.push({
          identity: publication.identity,
          ...merged,
        });
      }
     
      return publications;
    }
  }

  async findAllForUserNameRecomendation(
    nameUser: string,
  ): Promise<Publication[]> {
    console.log(
      `MATCH (userx:User WHERE userx.userName='${nameUser}')-[:LIKED]->(:Publication)
      <-[:LIKED]-(user2:User)-[r:LIKED*0..5]->(publication:Publication)<-[p:PUBLICATED]-(user:User) 
      RETURN DISTINCT publication,p,user`,
    );
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (userx:User WHERE userx.userName='${nameUser}')-[:LIKED]->(:Publication)
        <-[:LIKED]-(user2:User)-[r:LIKED*0..5]->(publication:Publication)<-[p:PUBLICATED]-(user:User) 
        RETURN DISTINCT publication,p,user`,
      )
      .run();

    if (query?.length > 0) {
      const publications: Publication[] = [];

      for (const publicationx of query) {
        const { publication, p, user } = publicationx;

        const { year, month, day, hour, minute, second, nanosecond } =
          p.properties.date_created;
        const dataTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
          parseInt(day),
        );
        let dateFinal = moment(dataTime).format('YYYY-MM-DD');
        let merged = {
          ...publication.properties,
          ...p.properties,
          date_created: dateFinal,
          ...{ user: { ...user.properties } },
        };

        publications.push({
          identity: publication.identity,
          ...merged,
        });
      }
      console.log(publications);
      return publications;
    }
  }

  async findAllForTypProperty(
    typeProperty: string,
    filter?: FilterPublicationInput,
  ): Promise<Publication[]> {
    let filterEntity = !filter
      ? ''
      : this.filterPublication.filterAll(filter, 'publication');
    console.log(`MATCH (publication:Publication WHERE publication.tipo= "${typeProperty}" ${filterEntity})<-[p:PUBLICATED]-(user:User)
    RETURN publication,p,user`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication WHERE publication.tipo= "${typeProperty}" ${filterEntity})<-[p:PUBLICATED]-(user:User) RETURN publication,p,user`,
      )
      .run();

    if (query?.length > 0) {
      const publications: Publication[] = [];

      for (const publicationx of query) {
        const { publication, p, user } = publicationx;

        const { year, month, day, hour, minute, second, nanosecond } =
          p.properties.date_created;
        const dataTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
          parseInt(day),
        );
        let dateFinal = moment(dataTime).format('YYYY-MM-DD');
        let merged = {
          ...publication.properties,
          ...p.properties,
          date_created: dateFinal,
          ...{ user: { ...user.properties } },
        };

        publications.push({
          identity: publication.identity,
          ...merged,
        });
      }
      console.log(publications);
      return publications;
    }
  }

  async updatePublication(
    updatePublicationInput: UpdatePublicationInput,
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
