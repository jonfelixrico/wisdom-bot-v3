import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteVoteQueryHandlerService } from './pending-quote-vote-query-handler.service'

describe('PendingQuoteVoteQueryHandlerService', () => {
  let service: PendingQuoteVoteQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteVoteQueryHandlerService],
    }).compile()

    service = module.get<PendingQuoteVoteQueryHandlerService>(
      PendingQuoteVoteQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
