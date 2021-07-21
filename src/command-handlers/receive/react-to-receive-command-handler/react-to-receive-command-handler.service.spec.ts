import { Test, TestingModule } from '@nestjs/testing'
import { ReactToReceiveCommandHandlerService } from './react-to-receive-command-handler.service'

describe('ReactToReceiveCommandHandlerService', () => {
  let service: ReactToReceiveCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactToReceiveCommandHandlerService],
    }).compile()

    service = module.get<ReactToReceiveCommandHandlerService>(
      ReactToReceiveCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
