import { Test, TestingModule } from '@nestjs/testing'
import { DomainEventPublisherService } from './domain-event-publisher.service'

describe('DomainEventPublisherService', () => {
  let service: DomainEventPublisherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainEventPublisherService],
    }).compile()

    service = module.get<DomainEventPublisherService>(
      DomainEventPublisherService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
