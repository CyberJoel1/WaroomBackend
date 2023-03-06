import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { LoginInput } from 'src/auth/dto/login.input';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { messageUpdate } from './entities/messageUpdate.entity';
import { UpdateUserInput } from './dto/update-user.input';
import * as moment from 'moment';
import { TreatedDenounceCommentInput } from 'src/comment/dto/treated-denounceComment.input';

@Injectable()
export class UserRepository {
  private logger = new Logger(UserRepository.name);
  constructor(private readonly queryRepository: QueryRepository) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const {
      userName,
      addressEmail,
      identification,
      dateBirth,
      fullName,
      password,
      roles,
      isActive,
      tipos,
    } = createUserInput;
    const fullNameUpperCase = fullName.toUpperCase();

    let roleString = `[`;
    roles.forEach((element, index) => {
      roleString += `"${element}"`;
      if (index < roles.length - 1) {
        roleString += `,`;
      }
    });
    roleString += `]`;
    const passwordCrypt = bcrypt.hashSync(password.toString(), 10);

    let date = moment(dateBirth).format('YYYY-MM-DD');
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `CREATE (user:User {userName: "${userName}", addressEmail: "${addressEmail}"
                        ,identification: "${identification}", password: "${passwordCrypt}"
                        ,fullName: "${fullNameUpperCase}" ,dateBirth:date("${date}") ,roles: ${roleString}
                        ,isActive: ${isActive}, tipo:"${tipos}"}) 
                        RETURN user`,
      )
      .run();

    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    }
  }

  async findUserProfile(userName: String): Promise<User> {
    let option = ` user.userName = "${userName}" `;
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
    WHERE` +
          option +
          `RETURN user`,
      )
      .run();
    console.log(query);
    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];
      const { year, month, day, hour, minute, second, nanosecond } =
      properties.dateBirth;
      
    const dataTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
      parseInt(day),
    );

    let dateFinal = moment(dataTime).format('DD/MM/YYYY');
    properties.dateBirth=dateFinal;
    console.log(properties);
      return {
        id: identity,
        dateBirth:dateFinal,
        ...properties,
      };
    } else {
      throw new BadRequestException('Los datos no son los correctos');
    }
  }

  async findUserProfileChat(addressEmail: String): Promise<User> {
    let option = ` user.addressEmail = "${addressEmail}" `;
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
    WHERE` +
          option +
          `RETURN user`,
      )
      .run();
    console.log(query);
    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];
      const { year, month, day, hour, minute, second, nanosecond } =
      properties.dateBirth;
      
    const dataTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
      parseInt(day),
    );

    let dateFinal = moment(dataTime).format('DD/MM/YYYY');
    properties.dateBirth=dateFinal;
      return {
        id: identity,
        ...properties,
        dateBirth:dateFinal,
      };
    } else {
      throw new BadRequestException('Los datos no son los correctos');
    }
  }

  async findOneUser(loginInput: LoginInput): Promise<User> {
    const { addressEmail, userName } = loginInput;
    let option = !addressEmail
      ? ` user.userName = "${userName}" `
      : ` user.addressEmail = "${addressEmail}" `;
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE user.isActive=true) 
    WHERE` +
          option +
          `RETURN user`,
      )
      .run();
    console.log(query);
    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];
      const { year, month, day, hour, minute, second, nanosecond } =
      properties.dateBirth;
      
    const dataTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // neo4j dates start at 1, js dates start at 0
      parseInt(day),
    );

    let dateFinal = moment(dataTime).format('DD/MM/YYYY');
    properties.dateBirth=dateFinal;
      return {
        id: identity,
        ...properties,
        dateBirth:dateFinal,
      };
    } else {
      throw new BadRequestException('Los datos no son los correctos');
    }
  }

  async findOneUserAdmin(loginInput: LoginInput): Promise<User> {
    const { addressEmail, userName } = loginInput;
    let option = !addressEmail
      ? ` user.userName = "${userName}" `
      : ` user.addressEmail = "${addressEmail}" AND user.roles=["client","admin"] `;
    console.log(
      `MATCH (user:User WHERE user.isActive=true) 
      WHERE` +
        option +
        `RETURN user`,
    );
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User WHERE user.isActive=true) 
    WHERE` +
          option +
          `RETURN user`,
      )
      .run();
    console.log(query);
    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    } else {
      throw new BadRequestException('Los datos no son los correctos');
    }
  }

  async findAll(roles: validRoles[]): Promise<User[]> {
    let roleString = `[`;
    roles.forEach((element, index) => {
      roleString += `"${element}"`;
      if (index < roles.length - 1) {
        roleString += `,`;
      }
    });
    roleString += `]`;

    let option = ` ALL(x IN ${roleString} WHERE x IN user.roles) `;
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
    WHERE` +
          option +
          `RETURN user`,
      )
      .run();

    if (query?.length > 0) {
      const users: User[] = [];

      for (const user of query) {
        const {
          user: { identity, properties },
        } = user;
        users.push({
          id: identity,
          ...properties,
        });
      }

      return users;
    }
  }

  async matchUserForRegex(user: string): Promise<User[]> {
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User)` +
          ` WHERE user.fullName =~ '.*${user}.*' ` +
          `RETURN user`,
      )
      .run();

    if (query?.length > 0) {
      const users: User[] = [];

      for (const user of query) {
        const {
          user: { identity, properties },
        } = user;
        users.push({
          id: identity,
          ...properties,
        });
      }

      return users;
    } else {
      return [];
    }
  }

  async findOneUserForId(id: number): Promise<User> {
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
    WHERE` +
          ` id(user) = ${id} ` +
          `RETURN user`,
      )
      .run();

    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    }
  }

  async blockUserForUsername(
    treatedDenounceCommentInput: TreatedDenounceCommentInput,
  ): Promise<messageUpdate> {
    const {userName,dateEndBlock} = treatedDenounceCommentInput;
    let date = moment(dateEndBlock).format('YYYY-MM-DD');
    console.log(`MATCH (user:User) WHERE user.userName = "${userName}" AND user.isActive = true 
    SET user.isActive = false, user.endBlock = date("${date}") RETURN user.userName`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE user.userName = "${userName}" AND user.isActive = true 
        SET user.isActive = false, user.endBlock = date("${date}") RETURN user.userName`,
      )
      .run();
    
    if (query?.length === 0) {
      throw new Error('Los datos no son los correctos');
    } else {
      return {
        message: `Se ha bloqueado el usuario ${query[0]['user.userName']}`,
      };
    }
  }

  async treatedBlockUser(
  ){
    
    let date = moment(new Date()).format('YYYY-MM-DD');
    console.log(`MATCH (user:User) WHERE (user.endBlock) is not null AND user.endBlock <= date("${date}") AND user.isActive = false 
    SET user.isActive = true RETURN user.userName`);
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) WHERE (user.endBlock) is not null AND user.endBlock <= date("${date}") AND user.isActive = false 
        SET user.isActive = true RETURN user.userName`,
      )
      .run();
    
    if (query?.length === 0) {
      this.logger.debug('Hoy no hubo un usuario que actualizar');
    } else {
      this.logger.debug('usuarios desbloquados');
    }
  }

  async updateUserforId(
    updateUser: UpdateUserInput,
    id: number,
  ): Promise<messageUpdate> {
    let date = moment(updateUser.dateBirth).format('YYYY-MM-DD');
    const passwordCrypt = bcrypt.hashSync(updateUser.password.toString(), 10);
    const fullNameUpperCase = updateUser.fullName.toUpperCase();
    //let date =moment(updateUser.dateBirth.toString(),'YYYY-MM-DD').toDate();
    console.log(`MATCH (user:User) 
    WHERE ID(user) = ${id}  AND user.isActive = true
    SET user.password = ${passwordCrypt}, user.identification = ${updateUser.identification},
     user.addressEmail = "${updateUser.addressEmail}", user.fullName = "${fullNameUpperCase}",
     user.userName = ${updateUser.userName}, user.dateBirth = date("${date}"), user.foto= "${updateUser.foto}" 
    RETURN user.userName`);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
        WHERE ID(user) = ${id}  AND user.isActive = true
        SET user.password = "${passwordCrypt}", user.identification = "${updateUser.identification}",
         user.addressEmail = "${updateUser.addressEmail}", user.fullName = "${updateUser.fullName}",
         user.userName = "${updateUser.userName}", user.dateBirth = date("${date}"), user.foto= "${updateUser.foto}"
        RETURN user.userName`,
      )
      .run();
    console.log(query);
    if (query?.length === 0) {
      throw new Error('Los datos no son los correctos');
    } else {
      return {
        message: `Se ha actualizado el usuario ${query[0]['user.userName']}`,
      };
    }
  }

  async findPropertyUser(id: number): Promise<User> {
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (publication:Publication)<-[:PUBLICATED]-(user:User)
    WHERE` +
          ` id(publication) = ${id} ` +
          `RETURN user`,
      )
      .run();

    if (query?.length > 0) {
      const {
        user: { identity, properties },
      } = query[0];

      return {
        id: identity,
        ...properties,
      };
    }
  }
}
