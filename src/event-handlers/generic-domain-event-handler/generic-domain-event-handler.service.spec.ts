import { Test, TestingModule } from '@nestjs/testing'
import { GenericDomainEventHandlerService } from './generic-domain-event-handler.service'

describe('GenericDomainEventHandlerService', () => {
  let service: GenericDomainEventHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericDomainEventHandlerService],
    }).compile()

    service = module.get<GenericDomainEventHandlerService>(
      GenericDomainEventHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
