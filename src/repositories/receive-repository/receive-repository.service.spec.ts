import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveRepositoryService } from './receive-repository.service'

describe('ReceiveRepositoryService', () => {
  let service: ReceiveRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveRepositoryService],
    }).compile()

    service = module.get<ReceiveRepositoryService>(ReceiveRepositoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
