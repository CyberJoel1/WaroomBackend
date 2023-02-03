import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { validRoles } from '../auth/enums/valid-roles.enum';
import { NotImplementedException, ParseIntPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { ValidRolesArgs } from './dto/args/roles.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../auth/decorators/user-current.decorator';
import { IsString } from 'class-validator';
import { messageUpdate } from './entities/messageUpdate.entity';
import { UpdateUserInput } from './dto/update-user.input';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User,{name: 'usercreate', description:'Crear un usuario determinado'})
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }


  @Query(() => [User], { name: 'findAllUser', description:' Trae los usuarios de un determinado rol' })
  @UseGuards(JwtAuthGuard)
  async findAll(@Args() validRoles:ValidRolesArgs,
  @CurrentUser([validRoles.user]) user: User): Promise<User[]>{
    const users = await this.userService.findAll(validRoles.roles);
      return users;
  }


  @Query(() => [String], { name: 'checkUser', description:' Trae los usuarios de un determinado rol' })
  @UseGuards(JwtAuthGuard)
  async checkUser(@Args() validRoles:ValidRolesArgs,
  @CurrentUser([validRoles.user]) user: User): Promise<any[]>{
    let variable: any[] = [user.userName];
    if(user.foto!=null){
      variable.push(user.foto);
    }
      return ([...variable]);
  }


  @Query(() => User, { name: 'getDataProfile', description:' Trae los datos necesarios para el perfil' })
  async dataProfile(@Args('userName') userName: String): Promise<User>{
    const user = await this.userService.findDataProfile(userName);
    return user;
  }

  @Query(() => User, { name: 'getDataProfileChat', description:' Trae los datos necesarios para el chat' })
  async chatProfile(@Args('addressEmail') addressEmail: String): Promise<User>{
    const user = await this.userService.findDataProfileChat(addressEmail);
    return user;
  }



  @Mutation(()=> messageUpdate,{name:'blockUser', description:'Va bloquear el usuario correspondiente'})
  @UseGuards(JwtAuthGuard)
  async UpdateUser(@Args('id', ParseIntPipe) id: number): Promise<messageUpdate> {
    return await this.userService.blockUser(id);
  }

  @Mutation(()=> messageUpdate,{name:'updateToUser', description:'Va a actualizar el usuario'})
  @UseGuards(JwtAuthGuard)
  UpdateUserId(@Args('updateUser') updateUser: UpdateUserInput,
  @CurrentUser([validRoles.user]) user: User){
    console.log(updateUser)
    return this.userService.updateUser(updateUser,user.id);
  }


  @Query(() => User, { name: 'findPropertyUser', description:' Trae los usuarios de un determinado rol' })
  @UseGuards(JwtAuthGuard)
  async findPropertyUser(@Args('id', ParseIntPipe) id: number): Promise<User>{
    const user = await this.userService.findPropertyuser(id);
    return user;
  }

  
  @Query(() => [User], { name: 'matchUser', description:' Trae los usuarios de un determinado rol' })
  @UseGuards(JwtAuthGuard)
  async matchUser(@Args('stringUser') stringUser: string): Promise<User[]>{
    return await this.userService.matchUser(stringUser);
    
  }
}
