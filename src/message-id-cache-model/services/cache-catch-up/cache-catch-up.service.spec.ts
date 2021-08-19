import { Test, TestingModule } from '@nestjs/testing'
import { CacheCatchUpService } from './cache-catch-up.service'

describe('CacheCatchUpService', () => {
  let service: CacheCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheCatchUpService],
    }).compile()

    service = module.get<CacheCatchUpService>(CacheCatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
