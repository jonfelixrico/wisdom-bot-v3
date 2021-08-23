import { Test, TestingModule } from '@nestjs/testing'
import { StatsModelCatchUpService } from './stats-model-catch-up.service'

describe('StatsModelCatchUpService', () => {
  let service: StatsModelCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsModelCatchUpService],
    }).compile()

    service = module.get<StatsModelCatchUpService>(StatsModelCatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
