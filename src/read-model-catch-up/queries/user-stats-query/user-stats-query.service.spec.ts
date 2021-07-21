import { Test, TestingModule } from '@nestjs/testing'
import { UserStatsQueryService } from './user-stats-query.service'

describe('UserStatsQueryService', () => {
  let service: UserStatsQueryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatsQueryService],
    }).compile()

    service = module.get<UserStatsQueryService>(UserStatsQueryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
