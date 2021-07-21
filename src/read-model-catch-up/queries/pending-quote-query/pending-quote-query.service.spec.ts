import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteQueryService } from './pending-quote-query.service'

describe('PendingQuoteQueryService', () => {
  let service: PendingQuoteQueryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteQueryService],
    }).compile()

    service = module.get<PendingQuoteQueryService>(PendingQuoteQueryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
