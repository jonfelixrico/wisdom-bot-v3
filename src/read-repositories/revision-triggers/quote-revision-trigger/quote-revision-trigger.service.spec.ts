import { Test, TestingModule } from '@nestjs/testing'
import { QuoteRevisionTriggerService } from './quote-revision-trigger.service'

describe('QuoteRevisionTriggerService', () => {
  let service: QuoteRevisionTriggerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteRevisionTriggerService],
    }).compile()

    service = module.get<QuoteRevisionTriggerService>(
      QuoteRevisionTriggerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
