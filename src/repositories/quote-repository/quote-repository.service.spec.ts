import { Test, TestingModule } from '@nestjs/testing'
import { QuoteRepositoryService } from './quote-repository.service'

describe('QuoteRepositoryService', () => {
  let service: QuoteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteRepositoryService],
    }).compile()

    service = module.get<QuoteRepositoryService>(QuoteRepositoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
