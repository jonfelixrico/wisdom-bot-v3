import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopContributorsQueryHandlerService } from './guild-top-contributors-query-handler.service'

describe('GuildTopContributorsQueryHandlerService', () => {
  let service: GuildTopContributorsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopContributorsQueryHandlerService],
    }).compile()

    service = module.get<GuildTopContributorsQueryHandlerService>(
      GuildTopContributorsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
