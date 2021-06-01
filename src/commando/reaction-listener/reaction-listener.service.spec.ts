import { Test, TestingModule } from '@nestjs/testing'
import { ReactionListenerService } from './reaction-listener.service'

describe('ReactionListenerService', () => {
  let service: ReactionListenerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionListenerService],
    }).compile()

    service = module.get<ReactionListenerService>(ReactionListenerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
