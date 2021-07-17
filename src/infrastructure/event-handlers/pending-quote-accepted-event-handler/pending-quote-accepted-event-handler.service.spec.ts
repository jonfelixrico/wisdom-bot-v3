import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteAcceptedEventHandlerService } from './pending-quote-accepted-event-handler.service'

describe('PendingQuoteAcceptedEventHandlerService', () => {
  let service: PendingQuoteAcceptedEventHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteAcceptedEventHandlerService],
    }).compile()

    service = module.get<PendingQuoteAcceptedEventHandlerService>(
      PendingQuoteAcceptedEventHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
