import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteRegeneratorService } from './pending-quote-regenerator.service'

describe('PendingQuoteRegeneratorService', () => {
  let service: PendingQuoteRegeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteRegeneratorService],
    }).compile()

    service = module.get<PendingQuoteRegeneratorService>(
      PendingQuoteRegeneratorService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
