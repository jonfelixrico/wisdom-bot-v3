import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteExpiredEventHandlerService } from './pending-quote-expired-event-handler.service'

describe('PendingQuoteExpiredEventHandlerService', () => {
  let service: PendingQuoteExpiredEventHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteExpiredEventHandlerService],
    }).compile()

    service = module.get<PendingQuoteExpiredEventHandlerService>(
      PendingQuoteExpiredEventHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
