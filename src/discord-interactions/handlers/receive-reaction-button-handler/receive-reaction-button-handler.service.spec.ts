import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveReactionButtonHandlerService } from './receive-reaction-button-handler.service'

describe('ReceiveReactionButtonHandlerService', () => {
  let service: ReceiveReactionButtonHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveReactionButtonHandlerService],
    }).compile()

    service = module.get<ReceiveReactionButtonHandlerService>(
      ReceiveReactionButtonHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
