import { Test, TestingModule } from '@nestjs/testing'
import { ReactionHelperService } from './reaction-helper.service'

describe('ReactionHelperService', () => {
  let service: ReactionHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionHelperService],
    }).compile()

    service = module.get<ReactionHelperService>(ReactionHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
