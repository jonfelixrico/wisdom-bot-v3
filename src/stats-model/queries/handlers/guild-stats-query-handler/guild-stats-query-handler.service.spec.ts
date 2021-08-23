import { Test, TestingModule } from '@nestjs/testing'
import { GuildStatsQueryHandlerService } from './guild-stats-query-handler.service'

describe('GuildStatsQueryHandlerService', () => {
  let service: GuildStatsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildStatsQueryHandlerService],
    }).compile()

    service = module.get<GuildStatsQueryHandlerService>(
      GuildStatsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
