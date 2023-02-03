import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentRepository } from './comment.repository';

@Module({
  providers: [CommentResolver, CommentService, CommentRepository]
})
export class CommentModule {}
