import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveQueryService } from './receive-query.service'

describe('ReceiveQueryService', () => {
  let service: ReceiveQueryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveQueryService],
    }).compile()

    service = module.get<ReceiveQueryService>(ReceiveQueryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
