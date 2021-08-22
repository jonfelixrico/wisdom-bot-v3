import { Test, TestingModule } from '@nestjs/testing'
import { StatsUserGeneralInteractionHandlerService } from './stats-user-general-interaction-handler.service'

describe('StatsUserGeneralInteractionHandlerService', () => {
  let service: StatsUserGeneralInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsUserGeneralInteractionHandlerService],
    }).compile()

    service = module.get<StatsUserGeneralInteractionHandlerService>(
      StatsUserGeneralInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
