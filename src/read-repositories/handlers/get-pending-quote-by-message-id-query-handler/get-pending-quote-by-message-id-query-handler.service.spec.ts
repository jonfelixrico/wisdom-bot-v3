import { Test, TestingModule } from '@nestjs/testing'
import { GetPendingQuoteByMessageIdQueryHandlerService } from './get-pending-quote-by-message-id-query-handler.service'

describe('GetPendingQuoteByMessageIdQueryHandlerService', () => {
  let service: GetPendingQuoteByMessageIdQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPendingQuoteByMessageIdQueryHandlerService],
    }).compile()

    service = module.get<GetPendingQuoteByMessageIdQueryHandlerService>(
      GetPendingQuoteByMessageIdQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
