import { Test, TestingModule } from '@nestjs/testing'
import { UserTopContributorsQueryHandlerService } from './user-top-contributors-query-handler.service'

describe('UserTopContributorsQueryHandlerService', () => {
  let service: UserTopContributorsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopContributorsQueryHandlerService],
    }).compile()

    service = module.get<UserTopContributorsQueryHandlerService>(
      UserTopContributorsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
