import { Test, TestingModule } from '@nestjs/testing'
import { WatchedMessagesCatchUp } from './watched-messages-catch-up.service'

describe('WatchedMessagesCatchUpService', () => {
  let service: WatchedMessagesCatchUp

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchedMessagesCatchUp],
    }).compile()

    service = module.get<WatchedMessagesCatchUp>(WatchedMessagesCatchUp)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
