import { Test, TestingModule } from '@nestjs/testing'
import { UserTopReceiversQueryHandlerService } from './user-top-receivers-query-handler.service'

describe('UserTopReceiversQueryHandlerService', () => {
  let service: UserTopReceiversQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTopReceiversQueryHandlerService],
    }).compile()

    service = module.get<UserTopReceiversQueryHandlerService>(
      UserTopReceiversQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
