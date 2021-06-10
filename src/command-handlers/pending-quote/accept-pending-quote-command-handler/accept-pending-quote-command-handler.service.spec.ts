import { Test, TestingModule } from '@nestjs/testing'
import { AcceptPendingQuoteCommandHandlerService } from './accept-pending-quote-command-handler.service'

describe('AcceptPendingQuoteCommandHandlerService', () => {
  let service: AcceptPendingQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptPendingQuoteCommandHandlerService],
    }).compile()

    service = module.get<AcceptPendingQuoteCommandHandlerService>(
      AcceptPendingQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
