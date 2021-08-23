import { Test, TestingModule } from '@nestjs/testing'
import { SubmitInteractionHandlerService } from './submit-interaction-handler.service'

describe('SubmitInteractionHandlerService', () => {
  let service: SubmitInteractionHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitInteractionHandlerService],
    }).compile()

    service = module.get<SubmitInteractionHandlerService>(
      SubmitInteractionHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
