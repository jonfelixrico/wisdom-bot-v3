import { Test, TestingModule } from '@nestjs/testing'
import { ReceiveCommandService } from './receive-command.service'

describe('ReceiveCommandService', () => {
  let service: ReceiveCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveCommandService],
    }).compile()

    service = module.get<ReceiveCommandService>(ReceiveCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
