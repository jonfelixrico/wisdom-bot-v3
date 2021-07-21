import { Test, TestingModule } from '@nestjs/testing'
import { QuoteSubmittedSyncEventHandlerService } from './quote-submitted-sync-event-handler.service'

describe('QuoteSubmittedSyncEventHandlerService', () => {
  let service: QuoteSubmittedSyncEventHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteSubmittedSyncEventHandlerService],
    }).compile()

    service = module.get<QuoteSubmittedSyncEventHandlerService>(
      QuoteSubmittedSyncEventHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
