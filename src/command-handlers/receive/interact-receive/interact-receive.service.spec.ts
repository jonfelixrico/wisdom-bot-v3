import { Test, TestingModule } from '@nestjs/testing'
import { InteractReceiveService } from './interact-receive.service'

describe('InteractReceiveService', () => {
  let service: InteractReceiveService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractReceiveService],
    }).compile()

    service = module.get<InteractReceiveService>(InteractReceiveService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
