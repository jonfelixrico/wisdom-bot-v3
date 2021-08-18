import { Test, TestingModule } from '@nestjs/testing'
import { GuildChannelPendingQuotesQueryHandlerService } from './guild-channel-pending-quotes-query-handler.service'

describe('GuildChannelPendingQuotesQueryHandlerService', () => {
  let service: GuildChannelPendingQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildChannelPendingQuotesQueryHandlerService],
    }).compile()

    service = module.get<GuildChannelPendingQuotesQueryHandlerService>(
      GuildChannelPendingQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
