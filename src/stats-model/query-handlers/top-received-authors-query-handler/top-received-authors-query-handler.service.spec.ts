import { Test, TestingModule } from '@nestjs/testing'
import { TopReceivedAuthorsQueryHandlerService } from './top-received-authors-query-handler.service'

describe('TopReceivedAuthorsQueryHandlerService', () => {
  let service: TopReceivedAuthorsQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopReceivedAuthorsQueryHandlerService],
    }).compile()

    service = module.get<TopReceivedAuthorsQueryHandlerService>(
      TopReceivedAuthorsQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
