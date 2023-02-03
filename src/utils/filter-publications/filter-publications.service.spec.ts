import { Test, TestingModule } from '@nestjs/testing';
import { FilterPublicationsService } from './filter-publications.service';

describe('FilterPublicationsService', () => {
  let service: FilterPublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterPublicationsService],
    }).compile();

    service = module.get<FilterPublicationsService>(FilterPublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
