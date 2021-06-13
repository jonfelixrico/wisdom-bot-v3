import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteRepoImplService } from './pending-quote-repo-impl.service'

describe('PendingQuoteRepoImplService', () => {
  let service: PendingQuoteRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteRepoImplService],
    }).compile()

    service = module.get<PendingQuoteRepoImplService>(
      PendingQuoteRepoImplService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
