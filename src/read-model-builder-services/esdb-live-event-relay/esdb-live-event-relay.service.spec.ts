import { Test, TestingModule } from '@nestjs/testing'
import { EsdbLiveEventRelayService } from './esdb-live-event-relay.service'

describe('EsdbLiveEventRelayService', () => {
  let service: EsdbLiveEventRelayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsdbLiveEventRelayService],
    }).compile()

    service = module.get<EsdbLiveEventRelayService>(EsdbLiveEventRelayService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
