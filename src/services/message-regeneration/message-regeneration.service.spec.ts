import { Test, TestingModule } from '@nestjs/testing'
import { MessageRegenerationService } from './message-regeneration.service'

describe('MessageRegenerationService', () => {
  let service: MessageRegenerationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRegenerationService],
    }).compile()

    service = module.get<MessageRegenerationService>(MessageRegenerationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
