import { Test, TestingModule } from '@nestjs/testing'
import { DeleteWatcherService } from './delete-watcher.service'

describe('DeleteWatcherService', () => {
  let service: DeleteWatcherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteWatcherService],
    }).compile()

    service = module.get<DeleteWatcherService>(DeleteWatcherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
