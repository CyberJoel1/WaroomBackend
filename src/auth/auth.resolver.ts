import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { CurrentUser } from './decorators/user-current.decorator';
import { User } from 'src/user/entities/user.entity';
import { validRoles } from './enums/valid-roles.enum';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  
  @Query(() => AuthResponse, { name: 'login', description:'Permite loguear un usuario'})
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalite', description:'Revalida un token correspondiente'})
  @UseGuards( JwtAuthGuard )
  revalidateToken(@CurrentUser([validRoles.user]) user:User): AuthResponse {
    return this.authService.refreshToken(user);
  }

  @Query(() => AuthResponse, { name: 'loginAdmin', description:'Permite loguear un administrador'})
  async loginAdmin(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.loginAdmin(loginInput);
  }


}
