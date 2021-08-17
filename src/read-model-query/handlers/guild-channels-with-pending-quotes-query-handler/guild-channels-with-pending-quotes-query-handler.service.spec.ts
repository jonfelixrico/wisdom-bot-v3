import { Test, TestingModule } from '@nestjs/testing'
import { GuildChannelsWithPendingQuotesQueryHandlerService } from './guild-channels-with-pending-quotes-query-handler.service'

describe('GuildChannelsWithPendingQuotesQueryHandlerService', () => {
  let service: GuildChannelsWithPendingQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildChannelsWithPendingQuotesQueryHandlerService],
    }).compile()

    service = module.get<GuildChannelsWithPendingQuotesQueryHandlerService>(
      GuildChannelsWithPendingQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
