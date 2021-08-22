import { Test, TestingModule } from '@nestjs/testing'
import { StatsUserTopcontributorsInteractionHandlerService } from './stats-user-topcontributors-interaction-handler.service'

describe('StatsUserTopcontributorsInteractionHandlerService', () => {
  let service: StatsUserTopcontributorsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsUserTopcontributorsInteractionHandlerService],
    }).compile()

    service = module.get<StatsUserTopcontributorsInteractionHandlerService>(
      StatsUserTopcontributorsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
