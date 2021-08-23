import { Test, TestingModule } from '@nestjs/testing'
import { UserTopAuthoredQuotesQueryHandlerService } from './user-top-authored-quotes-query-handler.service'

describe('UserTopAuthoredQuotesQueryHandlerService', () => {
  let service: UserTopAuthoredQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopAuthoredQuotesQueryHandlerService],
    }).compile()

    service = module.get<UserTopAuthoredQuotesQueryHandlerService>(
      UserTopAuthoredQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
