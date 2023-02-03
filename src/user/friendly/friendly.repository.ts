import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { QueryRepository } from 'src/neo4j/query.repository';
import { Friendly } from './entities/friendly.entity';
import { CreateFriendlyInput } from './dto/create-friendly.input';
import { Chat } from 'src/chat/entities/chat.entities';
import { User } from '../entities/user.entity';

@Injectable()
export class FriendlyRepository {
  constructor(private readonly queryRepository: QueryRepository) {}

  async createFriendly(
    userSend: number,
    createFriendlyInput: CreateFriendlyInput,
  ): Promise<boolean> {
    const { userReceived } = createFriendlyInput;
    let date = moment(new Date()).format('YYYY-MM-DD');
    console.log(`MATCH (userSend:User) WHERE id(userSend) = ${userSend}
          MATCH (userReceived:User) WHERE userReceived.userName = "${userReceived}"
          CREATE (userSend)-[:IS_FRIEND_WITH {date_created:date("${date}"), confirm:false}]->(userReceived)
          CREATE (userReceived)-[:IS_FRIEND_WITH {date_created:date("${date}"), confirm:true}]->(userSend)
          RETURN userSend`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (userSend:User) WHERE id(userSend) = ${userSend}
                MATCH (userReceived:User) WHERE userReceived.userName = "${userReceived}"
                CREATE (userSend)-[:IS_FRIEND_WITH {date_created:date("${date}"), confirm:false}]->(userReceived)
                CREATE (userReceived)-[:IS_FRIEND_WITH {date_created:date("${date}"), confirm:true}]->(userSend)
                RETURN userSend`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }

    return false;
  }

  async confirmFriendly(user1: number, user2: string): Promise<string> {
    console.log(`MATCH (user1:User) WHERE id(user1) = ${user1}
        MATCH (user2:User) WHERE user2.userName = "${user2}"
        MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
        MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
        RETURN friend1,friend2`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User) WHERE id(user1) = ${user1}
              MATCH (user2:User) WHERE user2.userName = "${user2}"
              MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
              MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
              RETURN friend1,friend2`,
      )
      .run();

    if (query?.length > 0) {
      const { friend1, friend2 } = query[0];
      if (friend1.properties.confirm && friend2.properties.confirm) {
        return 'amistad';
      }

      if (friend1.properties.confirm || friend2.properties.confirm) {
        return 'proceso';
      }
    }
    return 'no hay amistad';
  }

  async confirmChat(chat: Chat): Promise<any[]> {
    const { IsSend, idListened } = chat;
    console.log(`MATCH (user1:User) WHERE id(user1) = ${IsSend}
        MATCH (user2:User) WHERE user2.userName = ${idListened}
        MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
        MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
        RETURN friend1,friend2`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User) WHERE id(user1) = ${IsSend}
        MATCH (user2:User) WHERE user2.userName = "${idListened}"
        MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
        MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
        RETURN friend1,friend2`,
      )
      .run();

    if (query?.length > 0) {
      const { friend1, friend2 } = query[0];

      return [friend1.identity, friend2.identity];
    }
    return [];
  }

  async confirmChatListen(id: number, idRelation: number): Promise<boolean> {
    console.log(
      `MATCH (user1:User)<-[friend1:IS_FRIEND_WITH]-() 
      WHERE id(friend1) = ${idRelation} 
      and id(user1) = ${id}  RETURN friend1`,
    );

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User)<-[friend1:IS_FRIEND_WITH]-() 
        WHERE id(friend1) = ${idRelation} 
        and id(user1) = ${id}  RETURN friend1`,
      )
      .run();

    if (query?.length > 0) {
      return true;
    }
    return false;
  }

  async findAllRequestForUserName(
    nameUserReceived: string,
  ): Promise<Friendly[]> {
    console.log(`MATCH (user:User WHERE user.userName = '${nameUserReceived}')<-[friend:IS_FRIEND_WITH WHERE friend.confirm = false]-(user2:User)
    RETURN user2,friend 
    ORDER BY friend.date_created`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE user.userName = '${nameUserReceived}')<-[friend:IS_FRIEND_WITH WHERE friend.confirm = false]-(user2:User)
            RETURN user2,friend 
            ORDER BY friend.date_created`,
      )
      .run();

    if (query?.length > 0) {
      const friends: Friendly[] = [];

      for (const friendly of query) {
        const { user2, friend } = friendly;

        let merged = {
          ...friend.properties,
          ...{ user: { ...user2.properties } },
        };

        friends.push({
          idRelation: friend.identity,
          ...{ user: { ...user2.properties, id: user2.identity } },
        });
      }
      console.log(friends);
      return friends;
    }
  }

  async findAllFriends(nameUserReceived: string): Promise<User[]> {
    console.log(
      '......................................................................',
    );
    console.log(`MATCH (user:User WHERE user.userName="${nameUserReceived}")
    <-[friend:IS_FRIEND_WITH WHERE friend.confirm = true]-(user2:User)
    MATCH (user2)<-[friend2:IS_FRIEND_WITH WHERE friend2.confirm = true]-(user) 
    RETURN user2`);
    console.log(
      '......................................................................',
    );
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE user.userName="${nameUserReceived}")
        <-[friend:IS_FRIEND_WITH WHERE friend.confirm = true]-(user2:User)
        MATCH (user2)<-[friend2:IS_FRIEND_WITH WHERE friend2.confirm = true]-(user) 
        RETURN user2`,
      )
      .run();
    if (query?.length > 0) {
      const friends: User[] = [];

      for (const friendly of query) {
        const { user2 } = friendly;
        const user: User = { ...user2.properties, id: user2.identity };
        friends.push(user);
      }
      console.log(friends);
      return friends;
    }
  }

  async confirmRequestFriendly(id: number): Promise<any> {
    console.log(`MATCH (user1:User)<-[friend:IS_FRIEND_WITH ]-(user2:User) 
    WHERE id(friend) = ${id}
    SET friend.confirm = true 
    RETURN friend`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User)<-[friend:IS_FRIEND_WITH ]-(user2:User) 
        WHERE id(friend) = ${id}
        SET friend.confirm = true 
        RETURN friend,user1`,
      )
      .run();

    if (query?.length > 0) {
      const { friend, user1 } = query[0];
      return {
        ...{ user: { ...user1.properties } },
      };
    }
  }

  async deleteFriendly(user1: number, user2: string): Promise<boolean> {
    console.log(`MATCH (user1:User) WHERE id(user1)= ${user1}
          MATCH (user2:User) WHERE user2.userName = "${user2}"
          MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
          MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
          DELETE friend1,friend2`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user1:User) WHERE id(user1)= ${user1}
          MATCH (user2:User) WHERE user2.userName = "${user2}"
          MATCH (user1)-[friend1:IS_FRIEND_WITH]->(user2)
          MATCH (user1)<-[friend2:IS_FRIEND_WITH]-(user2)
          DETACH DELETE friend1,friend2`,
      )
      .run();

    return true;
  }
}
