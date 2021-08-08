import { Test, TestingModule } from '@nestjs/testing'
import { UserTopContributorsCommandService } from './user-top-contributors-command.service'

describe('UserTopContributorsCommandService', () => {
  let service: UserTopContributorsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopContributorsCommandService],
    }).compile()

    service = module.get<UserTopContributorsCommandService>(
      UserTopContributorsCommandService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
