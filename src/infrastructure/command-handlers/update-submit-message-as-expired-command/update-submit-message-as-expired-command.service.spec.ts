import { Test, TestingModule } from '@nestjs/testing'
import { UpdateSubmitMessageAsExpiredCommandService } from './update-submit-message-as-expired-command.service'

describe('UpdateSubmitMessageAsExpiredCommandService', () => {
  let service: UpdateSubmitMessageAsExpiredCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateSubmitMessageAsExpiredCommandService],
    }).compile()

    service = module.get<UpdateSubmitMessageAsExpiredCommandService>(
      UpdateSubmitMessageAsExpiredCommandService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
