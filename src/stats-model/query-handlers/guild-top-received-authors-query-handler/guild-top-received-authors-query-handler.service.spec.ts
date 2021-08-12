import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopReceivedAuthorsQueryHandlerService } from './guild-top-received-authors-query-handler.service'

describe('GuildTopReceivedAuthorsQueryHandlerService', () => {
  let service: GuildTopReceivedAuthorsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopReceivedAuthorsQueryHandlerService],
    }).compile()

    service = module.get<GuildTopReceivedAuthorsQueryHandlerService>(
      GuildTopReceivedAuthorsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
