import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveCatchUpService } from './receive-catch-up.service'

describe('ReceiveCatchUpService', () => {
  let service: ReceiveCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveCatchUpService],
    }).compile()

    service = module.get<ReceiveCatchUpService>(ReceiveCatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
