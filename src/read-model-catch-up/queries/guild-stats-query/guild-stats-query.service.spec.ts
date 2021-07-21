import { Test, TestingModule } from '@nestjs/testing'
import { GuildStatsQueryService } from './guild-stats-query.service'

describe('GuildStatsQueryService', () => {
  let service: GuildStatsQueryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildStatsQueryService],
    }).compile()

    service = module.get<GuildStatsQueryService>(GuildStatsQueryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
