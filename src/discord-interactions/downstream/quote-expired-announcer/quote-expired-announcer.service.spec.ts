import { Test, TestingModule } from '@nestjs/testing'
import { QuoteExpiredAnnouncerService } from './quote-expired-announcer.service'

describe('QuoteExpiredAnnouncerService', () => {
  let service: QuoteExpiredAnnouncerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteExpiredAnnouncerService],
    }).compile()

    service = module.get<QuoteExpiredAnnouncerService>(
      QuoteExpiredAnnouncerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
