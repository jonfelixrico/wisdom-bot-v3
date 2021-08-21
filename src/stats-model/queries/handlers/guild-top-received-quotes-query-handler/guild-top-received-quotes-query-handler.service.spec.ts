import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopReceivedQuotesQueryHandlerService } from './guild-top-received-quotes-query-handler.service'

describe('GuildTopReceivedQuotesQueryHandlerService', () => {
  let service: GuildTopReceivedQuotesQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopReceivedQuotesQueryHandlerService],
    }).compile()

    service = module.get<GuildTopReceivedQuotesQueryHandlerService>(
      GuildTopReceivedQuotesQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
