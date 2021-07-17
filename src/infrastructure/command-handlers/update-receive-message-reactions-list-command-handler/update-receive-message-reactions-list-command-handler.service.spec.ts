import { Test, TestingModule } from '@nestjs/testing'
import { UpdateReceiveMessageReactionsListCommandHandlerService } from './update-receive-message-reactions-list-command-handler.service'

describe('UpdateReceiveMessageReactionsListCommandHandlerService', () => {
  let service: UpdateReceiveMessageReactionsListCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateReceiveMessageReactionsListCommandHandlerService],
    }).compile()

    service =
      module.get<UpdateReceiveMessageReactionsListCommandHandlerService>(
        UpdateReceiveMessageReactionsListCommandHandlerService,
      )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
