import { Test, TestingModule } from '@nestjs/testing'
import { ReadRepositoriesEsdbService } from './read-repositories-esdb.service'

describe('ReadRepositoriesEsdbService', () => {
  let service: ReadRepositoriesEsdbService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadRepositoriesEsdbService],
    }).compile()

    service = module.get<ReadRepositoriesEsdbService>(
      ReadRepositoriesEsdbService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
