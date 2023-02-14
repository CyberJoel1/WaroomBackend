import { Injectable } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { User } from 'src/user/entities/user.entity';
import * as moment from 'moment';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';
import { DenounceComment } from './entities/denounce.entity';
import { CommentOutput } from './entities/commentOutput';

@Injectable()
export class CommentRepository {
  constructor(private readonly queryRepository: QueryRepository) {}

  async denounceComment(id: number, denounceComment: DenounceComment) {
    const { foto,userName,idComment,comment} = denounceComment;
    console.log(`
        MATCH (user:User) WHERE id(user) = ${id} 
              (user2:User) WHERE user2.userName = "${userName}"
           CREATE (user)-[p:DENOUNCE {identification: ${idComment}, foto:${foto}}]->(user2)
           RETURN p`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `
        MATCH (user:User) WHERE id(user) = ${id} 
        MATCH (user2:User) WHERE user2.userName = "${userName}"
           CREATE (user)-[p:DENOUNCE {identification: ${idComment}, foto:"${foto}", comment:"${comment}"}]->(user2)
           RETURN p`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }
  async countCommentDenounce(): Promise<number> {
    console.log(`MATCH p=()-[:DENOUNCE]->() RETURN count(p) as max`);
    const query = await this.queryRepository
      .initQuery()
      .raw(`MATCH p=()-[:DENOUNCE]->() RETURN count(p) as max`)
      .run();

    if (query?.length > 0) {
      const { max } = query[0];
      return parseInt(max);
    } else {
      return 0;
    }
  }

  async deleteDenounceComment(idDenounceComment: number) {
    console.log(`MATCH ()-[denounce:DENOUNCE]->()
    WHERE id(denounce) = ${idDenounceComment} DETACH DELETE denounce`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[denounce:DENOUNCE]->()
        WHERE id(denounce) = ${idDenounceComment} DETACH DELETE denounce`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async findAllCommentDenounce(skip?: number): Promise<CommentOutput[]> {
    const skipCount = skip ?? 0;
    console.log(`MATCH (user1:User)-[denounce:DENOUNCE]->(user2:User) RETURN user1,user2,denounce  
    ORDER BY id(denounce) SKIP ${skipCount} LIMIT 10`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User)-[denounce:DENOUNCE]->(user2:User) RETURN user1,user2,denounce  
        ORDER BY id(denounce) SKIP ${skipCount} LIMIT 10`,
      )
      .run();

      if (query?.length > 0) {
        const denounces: CommentOutput[] = [];
        
        for (const publicationx of query) {
          const { user1, user2, denounce } = publicationx;
          console.log(publicationx);
  
          denounces.push({
            idCommentary: denounce.identity,
            user1:{ id:user1.identity, ...user1.properties},
            user2:{ id:user2.identity, ...user2.properties},
            foto: denounce.properties.foto
          });
        }
        console.log(denounces);
        return denounces;
      }else{
        const denounces: any[] = [];
        return denounces;
      }
  }

  async deleteCommentPublication(id: number): Promise<Boolean> {
    console.log(`MATCH ()-[comment:COMMENTED]->()
    WHERE id(comment) = ${id} DELETE comment`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[comment:COMMENTED]->()
        WHERE id(comment) = ${id} DETACH DELETE comment`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async deleteDenouncesByUsername(userName:string): Promise<Boolean> {
    console.log(`MATCH ()-[denounce:DENOUNCE]->(user:User WHERE user.userName="${userName}") 
    DETACH DELETE denounce`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[denounce:DENOUNCE]->(user:User WHERE user.userName="${userName}") 
        DETACH DELETE denounce`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }



  async updateCommentPublication(
    updateCommentInput: UpdateCommentInput,
  ): Promise<Boolean> {
    const { comment, id } = updateCommentInput;

    console.log(`MATCH ()-[commented:COMMENTED]->()
          WHERE id(commented) = ${id} SET commented={comment:"${comment}"}`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH ()-[commented:COMMENTED]->()
              WHERE id(commented) = ${id} SET commented.comment="${comment}"`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async insertCommentPublication(
    id: number,
    createCommentInput: CreateCommentInput,
  ): Promise<boolean> {
    const { idPublication, comment, autor } = createCommentInput;
    let date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSS');
    console.log(`
        MATCH (user:User) WHERE id(user) = ${id}
            MATCH (publication:Publication) WHERE id(publication) = ${idPublication}
           CREATE (user)-[:COMMENTED {date_created: datetime("${date}"), comment: "${comment}", autor:${autor}}]->(publication)
           RETURN publication`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE id(user) = ${id}
             MATCH (publication:Publication) WHERE id(publication) = ${idPublication} 
             CREATE (user)-[:COMMENTED {date_created: datetime("${date}"), comment: "${comment}"}]->(publication) 
             RETURN publication`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async findAllCommentByPublication(
    id: number,
    pag: number,
    date: any,
  ): Promise<Comment[]> {
    console.log(`MATCH (user:User)-[comment:COMMENTED]->(publication:Publication)
    WHERE  id(publication) = ${id} AND comment.date_created IS NOT NULL AND 
    comment.date_created < datetime('${date}') 
    RETURN comment,user, comment.date_created AS theDateTime
    ORDER BY theDateTime DESC
    SKIP ${pag} LIMIT 5`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User)-[comment:COMMENTED]->(publication:Publication)
         WHERE  id(publication) = ${id} AND comment.date_created IS NOT NULL AND 
         comment.date_created < datetime('${date}') 
         RETURN comment,user, comment.date_created AS theDateTime
         ORDER BY theDateTime DESC
         SKIP ${pag} LIMIT 5`,
      )
      .run();

    if (query?.length > 0) {
      const comments: Comment[] = [];

      for (const commentaryElement of query) {
        const { comment, user, theDateTime } = commentaryElement;
        const { year, month, day, hour, minute, second, nanosecond } =
          theDateTime;
        const dataTime = new Date(
          parseInt(year),
          parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second),
          parseInt(nanosecond) / 1000000, // js dates use milliseconds
        );
        let dateFinal = moment(dataTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
        let merged = {
          ...comment.properties,
          date_created: dateFinal,
          ...{ user: { ...user.properties, id: user.identity } },
        };

        comments.push({
          id: comment.identity,
          ...merged,
        });
      }
      console.log(comments);
      return comments;
    }
  }
}
