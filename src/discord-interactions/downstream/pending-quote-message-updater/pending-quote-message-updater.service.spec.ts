import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteMessageUpdaterService } from './pending-quote-message-updater.service'

describe('PendingQuoteMessageUpdaterService', () => {
  let service: PendingQuoteMessageUpdaterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteMessageUpdaterService],
    }).compile()

    service = module.get<PendingQuoteMessageUpdaterService>(
      PendingQuoteMessageUpdaterService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
