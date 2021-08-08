import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopContributorsCommandService } from './guild-top-contributors-command.service'

describe('GuildTopContributorsCommandService', () => {
  let service: GuildTopContributorsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopContributorsCommandService],
    }).compile()

    service = module.get<GuildTopContributorsCommandService>(
      GuildTopContributorsCommandService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
