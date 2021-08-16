import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteQueryHandlerService } from './pending-quote-query-handler.service'

describe('PendingQuoteQueryHandlerService', () => {
  let service: PendingQuoteQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteQueryHandlerService],
    }).compile()

    service = module.get<PendingQuoteQueryHandlerService>(
      PendingQuoteQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
