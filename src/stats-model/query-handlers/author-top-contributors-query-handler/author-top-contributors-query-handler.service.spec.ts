import { Test, TestingModule } from '@nestjs/testing'
import { AuthorTopContributorsQueryHandlerService } from './author-top-contributors-query-handler.service'

describe('AuthorTopContributorsQueryHandlerService', () => {
  let service: AuthorTopContributorsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorTopContributorsQueryHandlerService],
    }).compile()

    service = module.get<AuthorTopContributorsQueryHandlerService>(
      AuthorTopContributorsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
