import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { LoginInput } from '../auth/dto/login.input';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { NotImplementedException } from '@nestjs/common';
import { messageUpdate } from './entities/messageUpdate.entity';
import { TreatedDenounceCommentInput } from 'src/comment/dto/treated-denounceComment.input';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  

  @Cron('0 0 0 * * *')
  async handleCron() {
    this.logger.debug('Inicia desbloquear usuarios');
    try {
      let user: any = await this.usersRepository.treatedBlockUser();
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  constructor(private readonly usersRepository: UserRepository) {}



  async findAll(roles: validRoles[]): Promise<User[]> {
    let users: User[] = await this.usersRepository.findAll([validRoles.user]);
    return users;
  }
  async findDataProfile(userName: String) {
    try {
      let user: User = await this.usersRepository.findUserProfile(userName);
      return user;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findDataProfileChat(addressEmail: String) {
    try {
      let user: User = await this.usersRepository.findUserProfileChat(addressEmail);
      return user;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }
  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = await this.usersRepository.createUser(createUserInput);

      return user;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async findOne(loginInput: LoginInput): Promise<User> {
    const user = await this.usersRepository.findOneUser(loginInput);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('Password incorrect');
    }
    return user;
  }

  async findOneAdmin(loginInput: LoginInput): Promise<User> {
    const user = await this.usersRepository.findOneUserAdmin(loginInput);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('Password incorrect');
    }
    return user;
  }


  async findOneForId(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneUserForId(id);
      return user;
    } catch (error) {
      throw new NotFoundException('no encontrando id:' + id);
    }
  }

  async blockUser(treatedDenounceCommentInput: TreatedDenounceCommentInput): Promise<messageUpdate> {
    try {
      const user = await this.usersRepository.blockUserForUsername(treatedDenounceCommentInput);
      return user;
    } catch (error) {
      throw new NotFoundException('No se ha encontrando el userName:' + treatedDenounceCommentInput.userName);
    }
  }

  async updateUser(
    updateUser: UpdateUserInput,
    id: number,
  ): Promise<messageUpdate> {
    try {
      const user = await this.usersRepository.updateUserforId(updateUser, id);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  private handleDBerrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Por favor chequea los logs');
  }


  async findPropertyuser(id:number): Promise<User> {
    try {
      const user = await this.usersRepository.findPropertyUser(id);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }


  async matchUser(userString:string): Promise<User[]> {
    try {
      const user = await this.usersRepository.matchUserForRegex(userString);
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
