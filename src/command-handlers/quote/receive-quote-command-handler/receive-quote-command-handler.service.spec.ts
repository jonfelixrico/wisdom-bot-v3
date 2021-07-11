import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveQuoteCommandHandlerService } from './receive-quote-command-handler.service'

describe('ReceiveQuoteCommandHandlerService', () => {
  let service: ReceiveQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveQuoteCommandHandlerService],
    }).compile()

    service = module.get<ReceiveQuoteCommandHandlerService>(
      ReceiveQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
