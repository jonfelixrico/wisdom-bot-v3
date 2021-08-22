import { Test, TestingModule } from '@nestjs/testing'
import { ServerStatsTopauthorsInteractionHandlerService } from './server-stats-topauthors-interaction-handler.service'

describe('ServerStatsTopauthorsInteractionHandlerService', () => {
  let service: ServerStatsTopauthorsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatsTopauthorsInteractionHandlerService],
    }).compile()

    service = module.get<ServerStatsTopauthorsInteractionHandlerService>(
      ServerStatsTopauthorsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
