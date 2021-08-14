import { Test, TestingModule } from '@nestjs/testing'
import { GuildQueryHandlerService } from './guild-query-handler.service'

describe('GuildQueryHandlerService', () => {
  let service: GuildQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuildQueryHandlerService],
    }).compile()

    service = module.get<GuildQueryHandlerService>(GuildQueryHandlerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
