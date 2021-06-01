import { Test, TestingModule } from '@nestjs/testing'
import { ConcurCommandService } from './concur-command.service'

describe('ConcurCommandService', () => {
  let service: ConcurCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcurCommandService],
    }).compile()

    service = module.get<ConcurCommandService>(ConcurCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
