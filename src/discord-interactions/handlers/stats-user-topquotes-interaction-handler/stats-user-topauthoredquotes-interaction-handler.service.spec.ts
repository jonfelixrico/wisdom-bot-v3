import { Test, TestingModule } from '@nestjs/testing'
import { StatsUserTopauthoredquotesInteractionHandlerService } from './stats-user-topauthoredquotes-interaction-handler.service'

describe('StatsUserTopauthoredquotesInteractionHandlerService', () => {
  let service: StatsUserTopauthoredquotesInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsUserTopauthoredquotesInteractionHandlerService],
    }).compile()

    service = module.get<StatsUserTopauthoredquotesInteractionHandlerService>(
      StatsUserTopauthoredquotesInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
