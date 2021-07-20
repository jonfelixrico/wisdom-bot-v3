import { Test, TestingModule } from '@nestjs/testing'
import { GuildStatsCommandService } from './guild-stats-command.service'

describe('GuildStatsCommandService', () => {
  let service: GuildStatsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildStatsCommandService],
    }).compile()

    service = module.get<GuildStatsCommandService>(GuildStatsCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
