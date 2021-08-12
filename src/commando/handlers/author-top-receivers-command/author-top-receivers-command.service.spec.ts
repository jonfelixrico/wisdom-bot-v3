import { Test, TestingModule } from '@nestjs/testing'
import { AuthorTopReceiversCommandService } from './author-top-receivers-command.service'

describe('AuthorTopReceiversCommandService', () => {
  let service: AuthorTopReceiversCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorTopReceiversCommandService],
    }).compile()

    service = module.get<AuthorTopReceiversCommandService>(
      AuthorTopReceiversCommandService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
