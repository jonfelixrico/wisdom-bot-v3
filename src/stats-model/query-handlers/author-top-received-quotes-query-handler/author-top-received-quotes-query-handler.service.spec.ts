import { Test, TestingModule } from '@nestjs/testing'
import { AuthorTopReceivedQuotesQueryHandlerService } from './author-top-received-quotes-query-handler.service'

describe('AuthorTopReceivedQuotesQueryHandlerService', () => {
  let service: AuthorTopReceivedQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorTopReceivedQuotesQueryHandlerService],
    }).compile()

    service = module.get<AuthorTopReceivedQuotesQueryHandlerService>(
      AuthorTopReceivedQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
