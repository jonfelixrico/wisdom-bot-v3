import { Test, TestingModule } from '@nestjs/testing'
import { AuthorTopReceiversQueryHandlerService } from './author-top-receivers-query-handler.service'

describe('AuthorTopReceiversQueryHandlerService', () => {
  let service: AuthorTopReceiversQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorTopReceiversQueryHandlerService],
    }).compile()

    service = module.get<AuthorTopReceiversQueryHandlerService>(
      AuthorTopReceiversQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
