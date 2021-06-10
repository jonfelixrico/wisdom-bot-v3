import { Test, TestingModule } from '@nestjs/testing'
import { CancelPendingQuoteCommandHandlerService } from './cancel-pending-quote-command-handler.service'

describe('CancelPendingQuoteCommandHandlerService', () => {
  let service: CancelPendingQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelPendingQuoteCommandHandlerService],
    }).compile()

    service = module.get<CancelPendingQuoteCommandHandlerService>(
      CancelPendingQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
