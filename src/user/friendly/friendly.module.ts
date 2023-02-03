import { Module } from '@nestjs/common';
import { FriendlyService } from './friendly.service';
import { FriendlyResolver } from './friendly.resolver';
import { FriendlyRepository } from './friendly.repository';

@Module({
  providers: [FriendlyResolver, FriendlyService,FriendlyRepository]
})
export class FriendlyModule {}
