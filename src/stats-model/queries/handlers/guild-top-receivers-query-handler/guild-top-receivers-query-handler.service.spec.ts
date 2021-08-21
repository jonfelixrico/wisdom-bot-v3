import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopReceiversQueryHandlerService } from './guild-top-receivers-query-handler.service'

describe('GuildTopReceiversQueryHandlerService', () => {
  let service: GuildTopReceiversQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopReceiversQueryHandlerService],
    }).compile()

    service = module.get<GuildTopReceiversQueryHandlerService>(
      GuildTopReceiversQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
