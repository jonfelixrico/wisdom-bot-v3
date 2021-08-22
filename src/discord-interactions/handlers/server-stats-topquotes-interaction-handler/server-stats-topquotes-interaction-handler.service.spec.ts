import { Test, TestingModule } from '@nestjs/testing'
import { ServerStatsTopquotesInteractionHandlerService } from './server-stats-topquotes-interaction-handler.service'

describe('ServerStatsTopquotesInteractionHandlerService', () => {
  let service: ServerStatsTopquotesInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatsTopquotesInteractionHandlerService],
    }).compile()

    service = module.get<ServerStatsTopquotesInteractionHandlerService>(
      ServerStatsTopquotesInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
