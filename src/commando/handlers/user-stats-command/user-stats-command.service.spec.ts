import { Test, TestingModule } from '@nestjs/testing'
import { UserStatsCommandService } from './user-stats-command.service'

describe('UserStatsCommandService', () => {
  let service: UserStatsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatsCommandService],
    }).compile()

    service = module.get<UserStatsCommandService>(UserStatsCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
