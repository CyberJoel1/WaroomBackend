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



  @Mutation(()=> messageUpdate,{name:'blockUser', description:'Va bloquear el usuario correspondiente'})
  @UseGuards(JwtAuthGuard)
  async UpdateUser(@Args('id', ParseIntPipe) id: number): Promise<messageUpdate> {
    return await this.userService.blockUser(id);
  }

  @Mutation(()=> messageUpdate,{name:'updateUser', description:'Va a actualizar el usuario'})
  @UseGuards(JwtAuthGuard)
  async UpdateUserId(@Args('updateUser') updateUser: UpdateUserInput){
    return await this.userService.updateUser(updateUser);
  }

}
