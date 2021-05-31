import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveRepoImplService } from './receive-repo-impl.service'

describe('ReceiveRepoImplService', () => {
  let service: ReceiveRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveRepoImplService],
    }).compile()

    service = module.get<ReceiveRepoImplService>(ReceiveRepoImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
