import { Test, TestingModule } from '@nestjs/testing'
import { GuildWriteRepositoryService } from './guild-write-repository.service'

describe('GuildWriteRepositoryService', () => {
  let service: GuildWriteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildWriteRepositoryService],
    }).compile()

    service = module.get<GuildWriteRepositoryService>(
      GuildWriteRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
