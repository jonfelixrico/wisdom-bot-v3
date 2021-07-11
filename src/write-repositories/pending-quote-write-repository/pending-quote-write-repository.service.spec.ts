import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteWriteRepositoryService } from './pending-quote-write-repository.service'

describe('PendingQuoteWriteRepositoryService', () => {
  let service: PendingQuoteWriteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteWriteRepositoryService],
    }).compile()

    service = module.get<PendingQuoteWriteRepositoryService>(
      PendingQuoteWriteRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
