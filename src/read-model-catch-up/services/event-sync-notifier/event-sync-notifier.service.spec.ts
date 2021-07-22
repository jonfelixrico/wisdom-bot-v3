import { Test, TestingModule } from '@nestjs/testing'
import { EventSyncNotifierService } from './event-sync-notifier.service'

describe('EventSyncNotifierService', () => {
  let service: EventSyncNotifierService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSyncNotifierService],
    }).compile()

    service = module.get<EventSyncNotifierService>(EventSyncNotifierService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
