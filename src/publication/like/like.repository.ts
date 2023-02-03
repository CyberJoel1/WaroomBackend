import { Injectable } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { CreateLikeInput } from './dto/create-like.input';

@Injectable()
export class LikeRepository {
  constructor(private readonly queryRepository: QueryRepository) {}

  async createLikePublication(idUser:number,
    createLikeInput: CreateLikeInput,
  ): Promise<boolean> {
    const { idPublication } = createLikeInput;
    console.log(`MATCH (user:User) WHERE id(user) = ${idUser}
    MATCH (publication:Publication) WHERE id(publication) = ${idPublication}
    CREATE (user:User)
        -[like:LIKED]->(publication:Publication)
       RETURN like`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE id(user) = ${idUser}
        MATCH (publication:Publication) WHERE id(publication) = ${idPublication}
        CREATE (user)
            -[like:LIKED]->(publication)
           RETURN like`,
      )
      .run();

    return true;
  }

  async deleteLikePublication(idUser:number,
    createLikeInput: CreateLikeInput,
  ): Promise<boolean> {
    const { idPublication } = createLikeInput;
    console.log(`MATCH (user:User WHERE id(user) = ${idUser})
        -[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
       DELETE like`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE id(user) = ${idUser})
            -[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
           DELETE like`,
      )
      .run();

    return true;
  }

  async checkLikePublication(idUser:number,
    createLikeInput: CreateLikeInput,
  ): Promise<boolean> {
    const { idPublication} = createLikeInput;
    console.log(`MATCH (user:User WHERE id(user) = ${idUser})
    -[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
   RETURN like`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE id(user) = ${idUser})
            -[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
           RETURN like`,
      )
      .run();

      if (query?.length > 0) {
        return true;
      }

      return false;
  }

  async countLikePublication(createLikeInput: CreateLikeInput,
  ): Promise<number> {
    const { idPublication } = createLikeInput;
    console.log(`MATCH ()-[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
    RETURN count(*) as conteo`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[like:LIKED]->(publication:Publication WHERE id(publication) = ${idPublication})
        RETURN count(*) as conteo`,
      )
      .run();
      if (query?.length > 0) {
        const { conteo } = query[0];
        
        return conteo;
      }
  }
}
