import { Test, TestingModule } from '@nestjs/testing'
import { QuoteVoteBtnInteractionHandlerService } from './quote-vote-btn-interaction-handler.service'

describe('QuoteVoteBtnInteractionHandlerService', () => {
  let service: QuoteVoteBtnInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteVoteBtnInteractionHandlerService],
    }).compile()

    service = module.get<QuoteVoteBtnInteractionHandlerService>(
      QuoteVoteBtnInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
