import { Test, TestingModule } from '@nestjs/testing'
import { SubmitCommandService } from './submit-command.service'

describe('SubmitCommandService', () => {
  let service: SubmitCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitCommandService],
    }).compile()

    service = module.get<SubmitCommandService>(SubmitCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
