import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveWriteRepositoryService } from './receive-write-repository.service'

describe('ReceiveWriteRepositoryService', () => {
  let service: ReceiveWriteRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveWriteRepositoryService],
    }).compile()

    service = module.get<ReceiveWriteRepositoryService>(
      ReceiveWriteRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
