import { Test, TestingModule } from '@nestjs/testing'
import { StatsCommandService } from './stats-command.service'

describe('StatsCommandService', () => {
  let service: StatsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsCommandService],
    }).compile()

    service = module.get<StatsCommandService>(StatsCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
