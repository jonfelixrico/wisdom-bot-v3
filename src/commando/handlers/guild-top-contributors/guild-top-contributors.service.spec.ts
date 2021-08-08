import { Test, TestingModule } from '@nestjs/testing'
import { GuildTopContributorsService } from './guild-top-contributors.service'

describe('GuildTopContributorsService', () => {
  let service: GuildTopContributorsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildTopContributorsService],
    }).compile()

    service = module.get<GuildTopContributorsService>(
      GuildTopContributorsService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
