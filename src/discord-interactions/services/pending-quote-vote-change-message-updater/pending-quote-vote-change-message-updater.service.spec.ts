import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteVoteChangeMessageUpdaterService } from './pending-quote-vote-change-message-updater.service'

describe('PendingQuoteVoteChangeMessageUpdaterService', () => {
  let service: PendingQuoteVoteChangeMessageUpdaterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteVoteChangeMessageUpdaterService],
    }).compile()

    service = module.get<PendingQuoteVoteChangeMessageUpdaterService>(
      PendingQuoteVoteChangeMessageUpdaterService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
