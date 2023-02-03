import { Test, TestingModule } from '@nestjs/testing';
import { FriendlyService } from './friendly.service';

describe('FriendlyService', () => {
  let service: FriendlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendlyService],
    }).compile();

    service = module.get<FriendlyService>(FriendlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
