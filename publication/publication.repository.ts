import { Injectable } from "@nestjs/common";
import { QueryRepository } from "src/neo4j/query.repository";
import { User } from "src/user/entities/user.entity";
import { CreatePublicationInput } from './dto/create-publication.input';
import { Publication } from "./entities/publication.entity";

@Injectable()
export class PublicationRepository {
  constructor(private readonly queryRepository: QueryRepository) {}
  async createPublication(createPublicationInput: CreatePublicationInput, user: User): Promise<Publication> {
    const {photos, tipo,banos, habitaciones,latitud,longitud,medida,message,titulo,activo } = createPublicationInput;
    let photosString = `[`;
    photos.forEach((element, index) => {
        photosString += `"${element}"`;
      if (index < photos.length - 1) {
        photosString += `,`;
      }
    });
    photosString += `]`;

    console.log(`MATCH (user:User) WHERE id(user) = ${user.id}
    CREATE (publication:Publication {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
    baños: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
    ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"})
   CREATE (user)-[:PUBLICATED {date_created:"${(new Date()).toLocaleDateString()}"}]->(publication)
   RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE id(user) = ${user.id}
         CREATE (publication:Publication {titulo: "${titulo}", longitud: ${longitud}, latitud: ${latitud},
         baños: ${banos}, habitaciones: ${habitaciones}, medida: ${medida}, message:"${message}"
         ,photos:${photosString}, activo: ${activo}, tipo:"${tipo}"})
        CREATE (user)-[:PUBLICATED {date_created:"${(new Date()).toLocaleDateString()}"}]->(publication)
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


}