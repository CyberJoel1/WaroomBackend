import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationResolver } from './publication.resolver';
import { PublicationRepository } from './publication.repository';
import { LikeModule } from './like/like.module';
import { FilterPublicationsModule } from 'src/utils/filter-publications/filter-publications.module';


@Module({
  providers: [PublicationResolver, PublicationService, PublicationRepository],
  imports: [LikeModule,FilterPublicationsModule]
})
export class PublicationModule {}
