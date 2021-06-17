import { Test, TestingModule } from '@nestjs/testing'
import { ReadStreamService } from './read-stream.service'

describe('ReadStreamService', () => {
  let service: ReadStreamService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadStreamService],
    }).compile()

    service = module.get<ReadStreamService>(ReadStreamService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
