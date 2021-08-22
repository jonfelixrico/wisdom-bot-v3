import { Test, TestingModule } from '@nestjs/testing'
import { ServerStatsGeneralInteractionHandlerService } from './server-stats-general-interaction-handler.service'

describe('ServerStatsGeneralInteractionHandlerService', () => {
  let service: ServerStatsGeneralInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatsGeneralInteractionHandlerService],
    }).compile()

    service = module.get<ServerStatsGeneralInteractionHandlerService>(
      ServerStatsGeneralInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
