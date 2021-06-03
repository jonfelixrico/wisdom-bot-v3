import { Test, TestingModule } from '@nestjs/testing'
import { StatsRepoImplService } from './stats-repo-impl.service'

describe('StatsRepoImplService', () => {
  let service: StatsRepoImplService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsRepoImplService],
    }).compile()

    service = module.get<StatsRepoImplService>(StatsRepoImplService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
