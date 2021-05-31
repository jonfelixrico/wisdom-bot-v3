import { Test, TestingModule } from '@nestjs/testing'
import { ConcurRepoImplService } from './concur-repo-impl.service'

describe('ConcurRepoImplService', () => {
  let service: ConcurRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcurRepoImplService],
    }).compile()

    service = module.get<ConcurRepoImplService>(ConcurRepoImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
