import { Test, TestingModule } from '@nestjs/testing'
import { QuoteSubmittedReducerService } from './quote-submitted-reducer.service'

describe('QuoteSubmittedReducerService', () => {
  let service: QuoteSubmittedReducerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteSubmittedReducerService],
    }).compile()

    service = module.get<QuoteSubmittedReducerService>(
      QuoteSubmittedReducerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
