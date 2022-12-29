import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryRepository } from 'src/neo4j/query.repository';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcrypt';
import { LoginInput } from 'src/auth/dto/login.input';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { messageUpdate } from './entities/messageUpdate.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserRepository {
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
    } = createUserInput;
    let roleString = `[`;
    roles.forEach((element, index) => {
      roleString += `"${element}"`;
      if (index < roles.length - 1) {
        roleString += `,`;
      }
    });
    roleString += `]`;
    const passwordCrypt = bcrypt.hashSync(password.toString(), 10);
    console.log(dateBirth);

    const query = await this.queryRepository
      .initQuery()
      .raw(
        `CREATE (user:User {userName: "${userName}", addressEmail: "${addressEmail}"
                        ,identification: "${identification}", password: "${passwordCrypt}"
                        ,fullName: "${fullName}" ,dateBirth: ("${dateBirth.toLocaleDateString()}") ,roles: ${roleString}
                        ,isActive: ${isActive}}) 
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

  async findOneUser(loginInput: LoginInput): Promise<User> {
    const { addressEmail, userName } = loginInput;
    let option = !addressEmail
      ? ` user.userName = "${userName}" `
      : ` user.addressEmail = "${addressEmail}" `;
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

  async blockUserForId(id: number): Promise<messageUpdate> {
    const query = await this.queryRepository
      .initQuery()
      .raw(
        `MATCH (user:User) 
        WHERE ID(user) = ${id}  AND user.isActive = true
        SET user.isActive = false
        RETURN user.userName`,
      )
      .run();
    console.log(query);
    if (query?.length === 0) {
      throw new Error('Los datos no son los correctos');
    } else {
      return {
        message: `Se ha bloqueado el usuario ${query[0]['user.userName']}`,
      };
    }
  }

  async updateUserforId(updateUser: UpdateUserInput): Promise<messageUpdate>{
    console.log(`MATCH (user:User) 
    WHERE ID(user) = ${updateUser.id}  AND user.isActive = true
    SET user.password = ${updateUser.password}, user.identification = ${updateUser.identification},
     user.addressEmail = ${updateUser.addressEmail}, user.fullName = "${updateUser.fullName}",
     user.userName = ${updateUser.userName}, user.dateBirth = ${updateUser.dateBirth} 
    RETURN user.userName`);
    const query = await this.queryRepository
    .initQuery()
    .raw(
      `MATCH (user:User) 
      WHERE ID(user) = ${updateUser.id}  AND user.isActive = true
      SET user.fullName = "${updateUser.fullName}"
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
}
