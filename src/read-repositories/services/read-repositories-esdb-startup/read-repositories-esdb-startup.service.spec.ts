import { Test, TestingModule } from '@nestjs/testing'
import { ReadRepositoriesEsdbStartupService } from './read-repositories-esdb-startup.service'

describe('ReadRepositoriesEsdbStartupService', () => {
  let service: ReadRepositoriesEsdbStartupService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadRepositoriesEsdbStartupService],
    }).compile()

    service = module.get<ReadRepositoriesEsdbStartupService>(
      ReadRepositoriesEsdbStartupService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
