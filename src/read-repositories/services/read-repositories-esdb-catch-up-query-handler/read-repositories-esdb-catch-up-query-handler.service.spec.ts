import { Test, TestingModule } from '@nestjs/testing'
import { ReadRepositoriesEsdbCatchUpQueryHandlerService } from './read-repositories-esdb-catch-up-query-handler.service'

describe('ReadRepositoriesEsdbCatchUpQueryHandlerService', () => {
  let service: ReadRepositoriesEsdbCatchUpQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadRepositoriesEsdbCatchUpQueryHandlerService],
    }).compile()

    service = module.get<ReadRepositoriesEsdbCatchUpQueryHandlerService>(
      ReadRepositoriesEsdbCatchUpQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
