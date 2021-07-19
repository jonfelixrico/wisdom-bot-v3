import { Test, TestingModule } from '@nestjs/testing'
import { UpvoteCommandService } from './upvote-command.service'

describe('UpvoteCommandService', () => {
  let service: UpvoteCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpvoteCommandService],
    }).compile()

    service = module.get<UpvoteCommandService>(UpvoteCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
