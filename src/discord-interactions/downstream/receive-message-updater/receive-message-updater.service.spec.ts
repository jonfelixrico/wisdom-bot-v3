import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveMessageUpdaterService } from './receive-message-updater.service';

describe('ReceiveMessageUpdaterService', () => {
  let service: ReceiveMessageUpdaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveMessageUpdaterService],
    }).compile();

    service = module.get<ReceiveMessageUpdaterService>(ReceiveMessageUpdaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
