import { Test, TestingModule } from '@nestjs/testing'
import { DiscordMessageCatchUpService } from './discord-message-catch-up.service'

describe('DiscordMessageCatchUpService', () => {
  let service: DiscordMessageCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordMessageCatchUpService],
    }).compile()

    service = module.get<DiscordMessageCatchUpService>(
      DiscordMessageCatchUpService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
