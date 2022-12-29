import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationResolver } from './publication.resolver';

@Module({
  providers: [PublicationResolver, PublicationService]
})
export class PublicationModule {}
