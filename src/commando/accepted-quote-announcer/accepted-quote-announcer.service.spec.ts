import { Test, TestingModule } from '@nestjs/testing'
import { AcceptedQuoteAnnouncerService } from './accepted-quote-announcer.service'

describe('AcceptedQuoteAnnouncerService', () => {
  let service: AcceptedQuoteAnnouncerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceptedQuoteAnnouncerService],
    }).compile()

    service = module.get<AcceptedQuoteAnnouncerService>(
      AcceptedQuoteAnnouncerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
