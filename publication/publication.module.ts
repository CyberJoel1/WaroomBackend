import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationResolver } from './publication.resolver';
import { PublicationRepository } from './publication.repository';

@Module({
  providers: [PublicationResolver, PublicationService, PublicationRepository]
})
export class PublicationModule {}
