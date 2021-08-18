import { Test, TestingModule } from '@nestjs/testing'
import { QuoteAcceptedAnnouncerService } from './quote-accepted-announcer.service'

describe('QuoteAcceptedAnnouncerService', () => {
  let service: QuoteAcceptedAnnouncerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteAcceptedAnnouncerService],
    }).compile()

    service = module.get<QuoteAcceptedAnnouncerService>(
      QuoteAcceptedAnnouncerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
