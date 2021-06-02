import { Test, TestingModule } from '@nestjs/testing'
import { ApprovalRewatcherService } from './approval-rewatcher.service'

describe('ApprovalRewatcherService', () => {
  let service: ApprovalRewatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprovalRewatcherService],
    }).compile()

    service = module.get<ApprovalRewatcherService>(ApprovalRewatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
