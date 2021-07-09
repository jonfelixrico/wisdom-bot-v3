import { Test, TestingModule } from '@nestjs/testing'
import { EventRelayService } from './event-relay.service'

describe('EventRelayService', () => {
  let service: EventRelayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRelayService],
    }).compile()

    service = module.get<EventRelayService>(EventRelayService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
