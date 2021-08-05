import { Test, TestingModule } from '@nestjs/testing'
import { BackupCatchUpService } from './backup-catch-up.service'

describe('BackupCatchUpService', () => {
  let service: BackupCatchUpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupCatchUpService],
    }).compile()

    service = module.get<BackupCatchUpService>(BackupCatchUpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
