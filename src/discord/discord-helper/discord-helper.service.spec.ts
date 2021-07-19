import { Test, TestingModule } from '@nestjs/testing'
import { DiscordHelperService } from './discord-helper.service'

describe('DiscordHelperService', () => {
  let service: DiscordHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordHelperService],
    }).compile()

    service = module.get<DiscordHelperService>(DiscordHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
