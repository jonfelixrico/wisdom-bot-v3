import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteRepositoryService } from './pending-quote-repository.service'

describe('PendingQuoteRepositoryService', () => {
  let service: PendingQuoteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteRepositoryService],
    }).compile()

    service = module.get<PendingQuoteRepositoryService>(
      PendingQuoteRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
