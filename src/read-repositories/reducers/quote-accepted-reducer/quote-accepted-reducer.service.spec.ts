import { Test, TestingModule } from '@nestjs/testing'
import { QuoteAcceptedReducerService } from './quote-accepted-reducer.service'

describe('QuoteAcceptedReducerService', () => {
  let service: QuoteAcceptedReducerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteAcceptedReducerService],
    }).compile()

    service = module.get<QuoteAcceptedReducerService>(
      QuoteAcceptedReducerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
