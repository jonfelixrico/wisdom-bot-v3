import { Test, TestingModule } from '@nestjs/testing'
import { ThrottledMessageFetcherService } from './throttled-message-fetcher.service'

describe('ThrottledMessageFetcherService', () => {
  let service: ThrottledMessageFetcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThrottledMessageFetcherService],
    }).compile()

    service = module.get<ThrottledMessageFetcherService>(
      ThrottledMessageFetcherService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
