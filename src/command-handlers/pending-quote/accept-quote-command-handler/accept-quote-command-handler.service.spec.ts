import { Test, TestingModule } from '@nestjs/testing'
import { AcceptQuoteCommandHandlerService } from './accept-quote-command-handler.service'

describe('AcceptQuoteCommandHandlerService', () => {
  let service: AcceptQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptQuoteCommandHandlerService],
    }).compile()

    service = module.get<AcceptQuoteCommandHandlerService>(
      AcceptQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
