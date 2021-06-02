import { Test, TestingModule } from '@nestjs/testing'
import { QuoteRegeneratorService } from './quote-regenerator.service'

describe('QuoteRegeneratorService', () => {
  let service: QuoteRegeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteRegeneratorService],
    }).compile()

    service = module.get<QuoteRegeneratorService>(QuoteRegeneratorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
