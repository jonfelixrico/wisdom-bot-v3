import { Test, TestingModule } from '@nestjs/testing'
import { ExpiredQuoteCheckingRoutineService } from './expired-quote-checking-routine.service'

describe('ExpiredQuoteCheckingRoutineService', () => {
  let service: ExpiredQuoteCheckingRoutineService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpiredQuoteCheckingRoutineService],
    }).compile()

    service = module.get<ExpiredQuoteCheckingRoutineService>(
      ExpiredQuoteCheckingRoutineService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
