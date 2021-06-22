import { Test, TestingModule } from '@nestjs/testing'
import { StreamsProjectionService } from './streams-projection.service'

describe('StreamsProjectionService', () => {
  let service: StreamsProjectionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamsProjectionService],
    }).compile()

    service = module.get<StreamsProjectionService>(StreamsProjectionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
