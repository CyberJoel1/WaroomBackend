import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './types/auth-response.types';
import { UserService } from '../user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,){

  }

  private getJwtToken(idUser: string){
    return this.jwtService.sign({id: idUser});
  }

  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  async login( loginInput: LoginInput): Promise<AuthResponse> {
    const {userName,addressEmail,password} = loginInput;
    const user = await this.userService.findOne({userName,addressEmail,password});
    const token = this.getJwtToken(user.id.toString());
    return {
      token,
      user
    }

  }

  async validateUser(id: number): Promise<User>{
    const user = await this.userService.findOneForId(id);
    
    return user;
  }

  refreshToken(user:User): AuthResponse{
    const token = this.getJwtToken(user.id.toString());
    return {
      token,
      user
    }
  }
}
