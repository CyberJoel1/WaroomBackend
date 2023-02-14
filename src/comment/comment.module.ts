import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentRepository } from './comment.repository';
import { UserService } from 'src/user/user.service';
import { PublicationService } from 'src/publication/publication.service';
import { PublicationRepository } from '../publication/publication.repository';
import { UserRepository } from 'src/user/user.repository';
import { PublicationModule } from 'src/publication/publication.module';

@Module({
  providers: [
    CommentResolver,
    CommentService,
    CommentRepository,
  ],
})
export class CommentModule {}
