import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserRepository } from 'src/user/user.repository';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [ AuthResolver, AuthService, JwtStrategy],
  exports:[ JwtStrategy, PassportModule, JwtModule],
  imports: [PassportModule.register({defaultStrategy:'jwt'}),
  ConfigModule,
  JwtModule.registerAsync({
    imports:[ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService)=>{
    
      return{
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn:'4h'
        }
      }
    }
  }),
    UserModule,] 
            
})
export class AuthModule {}
