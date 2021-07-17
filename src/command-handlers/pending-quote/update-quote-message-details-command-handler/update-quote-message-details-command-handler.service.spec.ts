import { Test, TestingModule } from '@nestjs/testing'
import { UpdateQuoteMessageDetailsCommandHandlerService } from './update-quote-message-details-command-handler.service'

describe('UpdateQuoteMessageIdCommandHandlerService', () => {
  let service: UpdateQuoteMessageDetailsCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateQuoteMessageDetailsCommandHandlerService],
    }).compile()

    service = module.get<UpdateQuoteMessageDetailsCommandHandlerService>(
      UpdateQuoteMessageDetailsCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
