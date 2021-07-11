import { Test, TestingModule } from '@nestjs/testing'
import { SubmitQuoteCommandHandlerService } from './submit-quote-command-handler.service'

describe('SubmitQuoteCommandHandlerService', () => {
  let service: SubmitQuoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitQuoteCommandHandlerService],
    }).compile()

    service = module.get<SubmitQuoteCommandHandlerService>(
      SubmitQuoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
