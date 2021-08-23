import { Test, TestingModule } from '@nestjs/testing'
import { StatsServerTopcontributorsInteractionHandlerService } from './stats-server-topcontributors-interaction-handler.service'

describe('StatsServerTopcontributorsInteractionHandlerService', () => {
  let service: StatsServerTopcontributorsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsServerTopcontributorsInteractionHandlerService],
    }).compile()

    service = module.get<StatsServerTopcontributorsInteractionHandlerService>(
      StatsServerTopcontributorsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
