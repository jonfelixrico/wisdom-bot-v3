import { Test, TestingModule } from '@nestjs/testing'
import { SubmitQuoteHandler } from './submit-quote.cmd-handler'

describe('SubmitQuote', () => {
  let provider: SubmitQuoteHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitQuoteHandler],
    }).compile()

    provider = module.get<SubmitQuoteHandler>(SubmitQuoteHandler)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
