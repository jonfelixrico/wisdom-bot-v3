import { Test, TestingModule } from '@nestjs/testing'
import { WatchedMessageQueryHandlerService } from './watched-message-query-handler.service'

describe('WatchedMessageQueryHandlerService', () => {
  let service: WatchedMessageQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchedMessageQueryHandlerService],
    }).compile()

    service = module.get<WatchedMessageQueryHandlerService>(
      WatchedMessageQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
