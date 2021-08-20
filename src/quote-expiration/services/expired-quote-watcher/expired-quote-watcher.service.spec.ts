import { Test, TestingModule } from '@nestjs/testing'
import { ExpiredQuoteWatcherService } from './expired-quote-watcher.service'

describe('ExpiredQuoteWatcherService', () => {
  let service: ExpiredQuoteWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpiredQuoteWatcherService],
    }).compile()

    service = module.get<ExpiredQuoteWatcherService>(ExpiredQuoteWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
