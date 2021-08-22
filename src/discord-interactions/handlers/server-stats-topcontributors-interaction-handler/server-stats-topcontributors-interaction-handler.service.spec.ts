import { Test, TestingModule } from '@nestjs/testing'
import { ServerStatsTopcontributorsInteractionHandlerService } from './server-stats-topcontributors-interaction-handler.service'

describe('ServerStatsTopcontributorsInteractionHandlerService', () => {
  let service: ServerStatsTopcontributorsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatsTopcontributorsInteractionHandlerService],
    }).compile()

    service = module.get<ServerStatsTopcontributorsInteractionHandlerService>(
      ServerStatsTopcontributorsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
