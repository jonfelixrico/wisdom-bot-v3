import { Test, TestingModule } from '@nestjs/testing'
import { PendingQuoteMessageRecacherService } from './pending-quote-message-recacher.service'

describe('PendingQuoteMessageRecacherService', () => {
  let service: PendingQuoteMessageRecacherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendingQuoteMessageRecacherService],
    }).compile()

    service = module.get<PendingQuoteMessageRecacherService>(
      PendingQuoteMessageRecacherService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
