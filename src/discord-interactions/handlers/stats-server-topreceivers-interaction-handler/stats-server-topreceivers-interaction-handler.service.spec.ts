import { Test, TestingModule } from '@nestjs/testing'
import { StatsServerTopreceiversInteractionHandlerService } from './stats-server-topreceivers-interaction-handler.service'

describe('StatsServerTopreceiversInteractionHandlerService', () => {
  let service: StatsServerTopreceiversInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsServerTopreceiversInteractionHandlerService],
    }).compile()

    service = module.get<StatsServerTopreceiversInteractionHandlerService>(
      StatsServerTopreceiversInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
