import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeRepository } from './like.repository';

@Module({
  providers: [LikeResolver, LikeService,LikeRepository]
})
export class LikeModule {}
