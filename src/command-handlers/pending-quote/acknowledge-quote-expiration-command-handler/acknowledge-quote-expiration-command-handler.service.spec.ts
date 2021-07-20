import { Test, TestingModule } from '@nestjs/testing'
import { AcknowledgeQuoteExpirationCommandHandlerService } from './acknowledge-quote-expiration-command-handler.service'

describe('AcknowledgeQuoteExpirationCommandHandlerService', () => {
  let service: AcknowledgeQuoteExpirationCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcknowledgeQuoteExpirationCommandHandlerService],
    }).compile()

    service = module.get<AcknowledgeQuoteExpirationCommandHandlerService>(
      AcknowledgeQuoteExpirationCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
