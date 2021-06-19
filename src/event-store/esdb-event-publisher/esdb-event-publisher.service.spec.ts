import { Test, TestingModule } from '@nestjs/testing'
import { EsdbEventPublisherService } from './esdb-event-publisher.service'

describe('EsdbEventPublisherService', () => {
  let service: EsdbEventPublisherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsdbEventPublisherService],
    }).compile()

    service = module.get<EsdbEventPublisherService>(EsdbEventPublisherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
