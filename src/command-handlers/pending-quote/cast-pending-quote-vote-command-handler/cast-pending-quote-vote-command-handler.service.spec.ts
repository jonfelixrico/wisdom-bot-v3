import { Test, TestingModule } from '@nestjs/testing'
import { CastPendingQuoteVoteCommandHandlerService } from './cast-pending-quote-vote-command-handler.service'

describe('CastPendingQuoteVoteCommandHandlerService', () => {
  let service: CastPendingQuoteVoteCommandHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CastPendingQuoteVoteCommandHandlerService],
    }).compile()

    service = module.get<CastPendingQuoteVoteCommandHandlerService>(
      CastPendingQuoteVoteCommandHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
