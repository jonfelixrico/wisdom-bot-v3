import { Test, TestingModule } from '@nestjs/testing'
import { InteractReceiveCommandHandlerService } from './interact-receive-command-handler.service'

describe('InteractReceiveCommandHandlerService', () => {
  let service: InteractReceiveCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractReceiveCommandHandlerService],
    }).compile()

    service = module.get<InteractReceiveCommandHandlerService>(
      InteractReceiveCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
