import { Test, TestingModule } from '@nestjs/testing'
import { SendQuoteAcceptedMessageCommandHandlerService } from './send-quote-accepted-message-command-handler.service'

describe('SendQuoteAcceptedMessageCommandHandlerService', () => {
  let service: SendQuoteAcceptedMessageCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendQuoteAcceptedMessageCommandHandlerService],
    }).compile()

    service = module.get<SendQuoteAcceptedMessageCommandHandlerService>(
      SendQuoteAcceptedMessageCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
