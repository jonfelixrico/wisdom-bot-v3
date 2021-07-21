import { Test, TestingModule } from '@nestjs/testing'
import { QuoteQueryService } from './quote-query.service'

describe('QuoteQueryService', () => {
  let service: QuoteQueryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteQueryService],
    }).compile()

    service = module.get<QuoteQueryService>(QuoteQueryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
