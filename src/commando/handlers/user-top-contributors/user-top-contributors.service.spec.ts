import { Test, TestingModule } from '@nestjs/testing'
import { UserTopContributorsService } from './user-top-contributors.service'

describe('UserTopContributorsService', () => {
  let service: UserTopContributorsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopContributorsService],
    }).compile()

    service = module.get<UserTopContributorsService>(UserTopContributorsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
