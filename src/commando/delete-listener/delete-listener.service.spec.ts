import { Test, TestingModule } from '@nestjs/testing'
import { DeleteListenerService } from './delete-listener.service'

describe('DeleteListenerService', () => {
  let service: DeleteListenerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteListenerService],
    }).compile()

    service = module.get<DeleteListenerService>(DeleteListenerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
