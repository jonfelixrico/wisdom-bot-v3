import { Test, TestingModule } from '@nestjs/testing'
import { TopReceiversQueryHandlerService } from './top-receivers-query-handler.service'

describe('TopReceiversQueryHandlerService', () => {
  let service: TopReceiversQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopReceiversQueryHandlerService],
    }).compile()

    service = module.get<TopReceiversQueryHandlerService>(
      TopReceiversQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
