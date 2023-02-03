import { Module } from '@nestjs/common';
import { FilterPublicationsService } from './filter-publications.service';

@Module({
    providers: [FilterPublicationsService],
    exports: [FilterPublicationsService],
    
})
export class FilterPublicationsModule {}
