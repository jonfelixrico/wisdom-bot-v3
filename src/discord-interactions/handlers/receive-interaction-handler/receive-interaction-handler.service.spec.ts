import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveInteractionHandlerService } from './receive-interaction-handler.service'

describe('ReceiveInteractionHandlerService', () => {
  let service: ReceiveInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveInteractionHandlerService],
    }).compile()

    service = module.get<ReceiveInteractionHandlerService>(
      ReceiveInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
