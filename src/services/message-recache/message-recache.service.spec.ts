import { Test, TestingModule } from '@nestjs/testing'
import { MessageRecacheService } from './message-recache.service'

describe('MessageRecacheService', () => {
  let service: MessageRecacheService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRecacheService],
    }).compile()

    service = module.get<MessageRecacheService>(MessageRecacheService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
