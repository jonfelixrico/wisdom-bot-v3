import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuotesStartupService } from './pending-quotes-startup.service'

describe('PendingQuotesStartupService', () => {
  let service: PendingQuotesStartupService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuotesStartupService],
    }).compile()

    service = module.get<PendingQuotesStartupService>(
      PendingQuotesStartupService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
