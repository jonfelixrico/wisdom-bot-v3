import { Test, TestingModule } from '@nestjs/testing'
import { CatchUpOrchestratorService } from './catch-up-orchestrator.service'

describe('CatchUpOrchestratorService', () => {
  let service: CatchUpOrchestratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatchUpOrchestratorService],
    }).compile()

    service = module.get<CatchUpOrchestratorService>(CatchUpOrchestratorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
