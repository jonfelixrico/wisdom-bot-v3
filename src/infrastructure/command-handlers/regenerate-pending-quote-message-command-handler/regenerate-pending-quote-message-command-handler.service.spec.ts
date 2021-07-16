import { Test, TestingModule } from '@nestjs/testing'
import { RegeneratePendingQuoteMessageCommandHandlerService } from './regenerate-pending-quote-message-command-handler.service'

describe('RegeneratePendingQuoteMessageCommandHandlerService', () => {
  let service: RegeneratePendingQuoteMessageCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegeneratePendingQuoteMessageCommandHandlerService],
    }).compile()

    service = module.get<RegeneratePendingQuoteMessageCommandHandlerService>(
      RegeneratePendingQuoteMessageCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
