import { Test, TestingModule } from '@nestjs/testing'
import { UpdateQuoteMessageIdCommandHandlerService } from './update-quote-message-id-command-handler.service'

describe('UpdateQuoteMessageIdCommandHandlerService', () => {
  let service: UpdateQuoteMessageIdCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateQuoteMessageIdCommandHandlerService],
    }).compile()

    service = module.get<UpdateQuoteMessageIdCommandHandlerService>(
      UpdateQuoteMessageIdCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
