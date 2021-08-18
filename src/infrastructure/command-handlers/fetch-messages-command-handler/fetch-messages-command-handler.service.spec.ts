import { Test, TestingModule } from '@nestjs/testing'
import { FetchMessagesCommandHandlerService } from './fetch-messages-command-handler.service'

describe('FetchMessagesCommandHandlerService', () => {
  let service: FetchMessagesCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchMessagesCommandHandlerService],
    }).compile()

    service = module.get<FetchMessagesCommandHandlerService>(
      FetchMessagesCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
