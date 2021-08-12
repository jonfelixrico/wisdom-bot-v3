import { Test, TestingModule } from '@nestjs/testing'
import { UserTopQuoteService } from './user-top-quote.service'

describe('UserTopQuoteService', () => {
  let service: UserTopQuoteService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopQuoteService],
    }).compile()

    service = module.get<UserTopQuoteService>(UserTopQuoteService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
