import { Test, TestingModule } from '@nestjs/testing'
import { ServerStatsTopreceiversInteractionHandlerService } from './server-stats-topreceivers-interaction-handler.service'

describe('ServerStatsTopreceiversInteractionHandlerService', () => {
  let service: ServerStatsTopreceiversInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerStatsTopreceiversInteractionHandlerService],
    }).compile()

    service = module.get<ServerStatsTopreceiversInteractionHandlerService>(
      ServerStatsTopreceiversInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
