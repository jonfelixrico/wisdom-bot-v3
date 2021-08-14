import { Test, TestingModule } from '@nestjs/testing'
import { InteractionCreatedRelayService } from './interaction-created-relay.service'

describe('InteractionCreatedRelayService', () => {
  let service: InteractionCreatedRelayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionCreatedRelayService],
    }).compile()

    service = module.get<InteractionCreatedRelayService>(
      InteractionCreatedRelayService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
