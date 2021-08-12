import { Test, TestingModule } from '@nestjs/testing'
import { InfoCommandService } from './info-command.service'

describe('InfoCommandService', () => {
  let service: InfoCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoCommandService],
    }).compile()

    service = module.get<InfoCommandService>(InfoCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
