import { Test, TestingModule } from '@nestjs/testing'
import { UpdateReceiveMessageDetailsCommandHandlerService } from './update-receive-message-details-command-handler.service'

describe('UpdateReceiveMessageDetailsCommandHandlerService', () => {
  let service: UpdateReceiveMessageDetailsCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateReceiveMessageDetailsCommandHandlerService],
    }).compile()

    service = module.get<UpdateReceiveMessageDetailsCommandHandlerService>(
      UpdateReceiveMessageDetailsCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
