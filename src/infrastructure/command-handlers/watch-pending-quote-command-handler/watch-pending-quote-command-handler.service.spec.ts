import { Test, TestingModule } from '@nestjs/testing'
import { WatchPendingQuoteCommandHandlerService } from './watch-pending-quote-command-handler.service'

describe('WatchPendingQuoteCommandHandlerService', () => {
  let service: WatchPendingQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchPendingQuoteCommandHandlerService],
    }).compile()

    service = module.get<WatchPendingQuoteCommandHandlerService>(
      WatchPendingQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
