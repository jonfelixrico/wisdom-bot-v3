import { Test, TestingModule } from '@nestjs/testing'
import { StatsServerGeneralInteractionHandlerService } from './stats-server-general-interaction-handler.service'

describe('StatsServerGeneralInteractionHandlerService', () => {
  let service: StatsServerGeneralInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsServerGeneralInteractionHandlerService],
    }).compile()

    service = module.get<StatsServerGeneralInteractionHandlerService>(
      StatsServerGeneralInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
