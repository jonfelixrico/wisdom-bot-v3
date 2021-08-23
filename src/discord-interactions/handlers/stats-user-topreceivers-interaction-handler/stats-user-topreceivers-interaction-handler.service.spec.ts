import { Test, TestingModule } from '@nestjs/testing'
import { StatsUserTopreceiversInteractionHandlerService } from './stats-user-topreceivers-interaction-handler.service'

describe('StatsUserTopreceiversInteractionHandlerService', () => {
  let service: StatsUserTopreceiversInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsUserTopreceiversInteractionHandlerService],
    }).compile()

    service = module.get<StatsUserTopreceiversInteractionHandlerService>(
      StatsUserTopreceiversInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
