import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveQueryHandlerService } from './receive-query-handler.service'

describe('ReceiveQueryHandlerService', () => {
  let service: ReceiveQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveQueryHandlerService],
    }).compile()

    service = module.get<ReceiveQueryHandlerService>(ReceiveQueryHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
