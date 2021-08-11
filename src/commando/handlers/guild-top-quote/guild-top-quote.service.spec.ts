import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopQuoteService } from './guild-top-quote.service'

describe('GuildTopQuoteService', () => {
  let service: GuildTopQuoteService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopQuoteService],
    }).compile()

    service = module.get<GuildTopQuoteService>(GuildTopQuoteService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
