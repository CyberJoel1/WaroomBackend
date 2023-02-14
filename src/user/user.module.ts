import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { UtilsMoment } from 'src/utils/moment.js/utils-momentjs';
import { DateScalar } from 'src/scalars/DateScalar.scalars';
import { FriendlyModule } from './friendly/friendly.module';
import { PublicationModule } from 'src/publication/publication.module';
import { CommentModule } from '../comment/comment.module';
import { CommentService } from '../comment/comment.service';
import { PublicationService } from '../publication/publication.service';
import { PublicationRepository } from '../publication/publication.repository';
import { CommentRepository } from '../comment/comment.repository';
import { FilterPublicationsService } from '../utils/filter-publications/filter-publications.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    PublicationModule,
    CommentModule,
    CommentService,
    PublicationService,
    PublicationRepository,
    CommentRepository,
    FilterPublicationsService,
  ],
  exports: [UserRepository, UserService],
  imports: [
    FriendlyModule,
    CommentModule,
    PublicationModule,
    ScheduleModule.forRoot(),
  ],
})
export class UserModule {}
