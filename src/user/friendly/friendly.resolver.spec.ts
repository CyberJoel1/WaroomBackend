import { Test, TestingModule } from '@nestjs/testing';
import { FriendlyResolver } from './friendly.resolver';
import { FriendlyService } from './friendly.service';

describe('FriendlyResolver', () => {
  let resolver: FriendlyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendlyResolver, FriendlyService],
    }).compile();

    resolver = module.get<FriendlyResolver>(FriendlyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
