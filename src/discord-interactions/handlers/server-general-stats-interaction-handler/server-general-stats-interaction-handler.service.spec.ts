import { Test, TestingModule } from '@nestjs/testing'
import { ServerGeneralStatsInteractionHandlerService } from './server-general-stats-interaction-handler.service'

describe('ServerGeneralStatsInteractionHandlerService', () => {
  let service: ServerGeneralStatsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerGeneralStatsInteractionHandlerService],
    }).compile()

    service = module.get<ServerGeneralStatsInteractionHandlerService>(
      ServerGeneralStatsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
