import { Test, TestingModule } from '@nestjs/testing'
import { QuoteWriteRepositoryService } from './quote-write-repository.service'

describe('QuoteWriteRepositoryService', () => {
  let service: QuoteWriteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteWriteRepositoryService],
    }).compile()

    service = module.get<QuoteWriteRepositoryService>(
      QuoteWriteRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
