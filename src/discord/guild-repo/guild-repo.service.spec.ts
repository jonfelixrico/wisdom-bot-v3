import { Test, TestingModule } from '@nestjs/testing'
import { GuildRepoService } from './guild-repo.service'

describe('GuildRepoService', () => {
  let service: GuildRepoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildRepoService],
    }).compile()

    service = module.get<GuildRepoService>(GuildRepoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
