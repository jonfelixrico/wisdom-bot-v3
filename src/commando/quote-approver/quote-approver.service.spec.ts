import { Test, TestingModule } from '@nestjs/testing';
import { QuoteApproverService } from './quote-approver.service';

describe('QuoteApproverService', () => {
  let service: QuoteApproverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteApproverService],
    }).compile();

    service = module.get<QuoteApproverService>(QuoteApproverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
