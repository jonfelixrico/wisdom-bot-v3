import { Test, TestingModule } from '@nestjs/testing'
import { InteractionHelperService } from './interaction-helper.service'

describe('InteractionHelperService', () => {
  let service: InteractionHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionHelperService],
    }).compile()

    service = module.get<InteractionHelperService>(InteractionHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
