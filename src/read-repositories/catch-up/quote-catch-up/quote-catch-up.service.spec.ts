import { Test, TestingModule } from '@nestjs/testing'
import { QuoteCatchUpService } from './quote-catch-up.service'

describe('QuoteCatchUpService', () => {
  let service: QuoteCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteCatchUpService],
    }).compile()

    service = module.get<QuoteCatchUpService>(QuoteCatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
