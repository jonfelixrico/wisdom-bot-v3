import { Test, TestingModule } from '@nestjs/testing'
import { StatsServerTopauthorsInteractionHandlerService } from './stats-server-topauthors-interaction-handler.service'

describe('StatsServerTopauthorsInteractionHandlerService', () => {
  let service: StatsServerTopauthorsInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsServerTopauthorsInteractionHandlerService],
    }).compile()

    service = module.get<StatsServerTopauthorsInteractionHandlerService>(
      StatsServerTopauthorsInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
