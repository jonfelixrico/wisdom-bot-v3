import { Test, TestingModule } from '@nestjs/testing'
import { QuoteRepoImplService } from './quote-repo-impl.service'

describe('QuoteRepoImplService', () => {
  let service: QuoteRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteRepoImplService],
    }).compile()

    service = module.get<QuoteRepoImplService>(QuoteRepoImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
