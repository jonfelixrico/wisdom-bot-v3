import { Test, TestingModule } from '@nestjs/testing'
import { CatchUpService } from './catch-up.service'

describe('CatchUpService', () => {
  let service: CatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatchUpService],
    }).compile()

    service = module.get<CatchUpService>(CatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
