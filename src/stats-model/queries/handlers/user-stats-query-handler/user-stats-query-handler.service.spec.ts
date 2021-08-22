import { Test, TestingModule } from '@nestjs/testing'
import { UserStatsQueryHandlerService } from './user-stats-query-handler.service'

describe('UserStatsQueryHandlerService', () => {
  let service: UserStatsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatsQueryHandlerService],
    }).compile()

    service = module.get<UserStatsQueryHandlerService>(
      UserStatsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
