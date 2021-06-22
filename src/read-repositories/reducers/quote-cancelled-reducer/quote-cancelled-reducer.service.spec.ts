import { Test, TestingModule } from '@nestjs/testing'
import { QuoteCancelledReducerService } from './quote-cancelled-reducer.service'

describe('QuoteCancelledReducerService', () => {
  let service: QuoteCancelledReducerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteCancelledReducerService],
    }).compile()

    service = module.get<QuoteCancelledReducerService>(
      QuoteCancelledReducerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
