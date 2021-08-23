import { Test, TestingModule } from '@nestjs/testing'
import { QuoteExpirationCatchUpService } from './quote-expiration-catch-up.service'

describe('QuoteExpirationCatchUpService', () => {
  let service: QuoteExpirationCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteExpirationCatchUpService],
    }).compile()

    service = module.get<QuoteExpirationCatchUpService>(
      QuoteExpirationCatchUpService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
