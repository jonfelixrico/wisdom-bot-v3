import { Test, TestingModule } from '@nestjs/testing'
import { DownvoteCommandService } from './downvote-command.service'

describe('DownvoteCommandService', () => {
  let service: DownvoteCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownvoteCommandService],
    }).compile()

    service = module.get<DownvoteCommandService>(DownvoteCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
