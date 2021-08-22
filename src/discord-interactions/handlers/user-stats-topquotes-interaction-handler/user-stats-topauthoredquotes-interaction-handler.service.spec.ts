import { Test, TestingModule } from '@nestjs/testing'
import { UserStatsTopauthoredquotesInteractionHandlerService } from './user-stats-topauthoredquotes-interaction-handler.service'

describe('UserStatsTopauthoredquotesInteractionHandlerService', () => {
  let service: UserStatsTopauthoredquotesInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatsTopauthoredquotesInteractionHandlerService],
    }).compile()

    service = module.get<UserStatsTopauthoredquotesInteractionHandlerService>(
      UserStatsTopauthoredquotesInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
