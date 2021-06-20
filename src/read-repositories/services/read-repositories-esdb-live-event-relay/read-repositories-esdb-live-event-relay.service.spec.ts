import { Test, TestingModule } from '@nestjs/testing'
import { ReadRepositoriesEsdbLiveEventRelayService } from './read-repositories-esdb-live-event-relay.service'

describe('ReadRepositoriesEsdbLiveEventRelayService', () => {
  let service: ReadRepositoriesEsdbLiveEventRelayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadRepositoriesEsdbLiveEventRelayService],
    }).compile()

    service = module.get<ReadRepositoriesEsdbLiveEventRelayService>(
      ReadRepositoriesEsdbLiveEventRelayService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
