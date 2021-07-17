import { Test, TestingModule } from '@nestjs/testing'
import { SendQuoteAcceptedNotificationCommandHandlerService } from './send-quote-accepted-notification-command-handler.service'

describe('SendQuoteAcceptedNotificationCommandHandlerService', () => {
  let service: SendQuoteAcceptedNotificationCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendQuoteAcceptedNotificationCommandHandlerService],
    }).compile()

    service = module.get<SendQuoteAcceptedNotificationCommandHandlerService>(
      SendQuoteAcceptedNotificationCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
