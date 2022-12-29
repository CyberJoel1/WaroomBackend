import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { UtilsMoment } from 'src/utils/moment.js/utils-momentjs';
import { DateScalar } from 'src/scalars/DateScalar.scalars';



@Module({
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserRepository,UserService],
  imports:[]
})
export class UserModule {}
