import { Test, TestingModule } from '@nestjs/testing';
import { TopContributorsCommandService } from './top-contributors-command.service';

describe('TopContributorsCommandService', () => {
  let service: TopContributorsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopContributorsCommandService],
    }).compile();

    service = module.get<TopContributorsCommandService>(TopContributorsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
