import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopReceiversCommandService } from './guild-top-receivers-command.service'

describe('GuildTopReceiversCommandService', () => {
  let service: GuildTopReceiversCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopReceiversCommandService],
    }).compile()

    service = module.get<GuildTopReceiversCommandService>(
      GuildTopReceiversCommandService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
