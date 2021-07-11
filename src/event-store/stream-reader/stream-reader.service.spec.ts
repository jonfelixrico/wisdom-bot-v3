import { Test, TestingModule } from '@nestjs/testing'
import { StreamReaderService } from './stream-reader.service'

describe('StreamReaderService', () => {
  let service: StreamReaderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamReaderService],
    }).compile()

    service = module.get<StreamReaderService>(StreamReaderService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
