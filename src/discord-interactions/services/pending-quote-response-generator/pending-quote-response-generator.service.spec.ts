import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteResponseGeneratorService } from './pending-quote-response-generator.service'

describe('PendingQuoteResponseGeneratorService', () => {
  let service: PendingQuoteResponseGeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteResponseGeneratorService],
    }).compile()

    service = module.get<PendingQuoteResponseGeneratorService>(
      PendingQuoteResponseGeneratorService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
