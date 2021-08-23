import { Test, TestingModule } from '@nestjs/testing'
import { StatsServerTopquotesInteractionHandlerService } from './stats-server-topquotes-interaction-handler.service'

describe('StatsServerTopquotesInteractionHandlerService', () => {
  let service: StatsServerTopquotesInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsServerTopquotesInteractionHandlerService],
    }).compile()

    service = module.get<StatsServerTopquotesInteractionHandlerService>(
      StatsServerTopquotesInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
