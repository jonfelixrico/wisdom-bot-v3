import { Test, TestingModule } from '@nestjs/testing'
import { UserTopReceivedQuotesQueryHandlerService } from './user-top-received-quotes-query-handler.service'

describe('UserTopReceivedQuotesQueryHandlerService', () => {
  let service: UserTopReceivedQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopReceivedQuotesQueryHandlerService],
    }).compile()

    service = module.get<UserTopReceivedQuotesQueryHandlerService>(
      UserTopReceivedQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
