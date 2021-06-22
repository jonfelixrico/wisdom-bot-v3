import { Test, TestingModule } from '@nestjs/testing'
import { ReadEventConsumedHandlerService } from './read-event-consumed-handler.service'

describe('ReadEventConsumedHandlerService', () => {
  let service: ReadEventConsumedHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadEventConsumedHandlerService],
    }).compile()

    service = module.get<ReadEventConsumedHandlerService>(
      ReadEventConsumedHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
