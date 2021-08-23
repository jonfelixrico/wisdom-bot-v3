import { Test, TestingModule } from '@nestjs/testing'
import { CommandManagerService } from './command-manager.service'

describe('CommandManagerService', () => {
  let service: CommandManagerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandManagerService],
    }).compile()

    service = module.get<CommandManagerService>(CommandManagerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
