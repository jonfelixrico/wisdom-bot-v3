import { Test, TestingModule } from '@nestjs/testing'
import { GuildRepoImplService } from './guild-repo-impl.service'

describe('GuildRepoImplService', () => {
  let service: GuildRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildRepoImplService],
    }).compile()

    service = module.get<GuildRepoImplService>(GuildRepoImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
