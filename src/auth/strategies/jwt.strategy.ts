import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
        secretOrKey: configService.get('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    
    const user = await this.authService.validateUser(payload.id);
    delete user.password;
    return user;
  }
}
