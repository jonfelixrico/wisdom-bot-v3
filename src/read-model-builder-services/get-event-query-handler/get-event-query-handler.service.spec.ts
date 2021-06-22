import { Test, TestingModule } from '@nestjs/testing'
import { GetEventQueryHandlerService } from './get-event-query-handler.service'

describe('GetEventQueryHandlerService', () => {
  let service: GetEventQueryHandlerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetEventQueryHandlerService],
    }).compile()

    service = module.get<GetEventQueryHandlerService>(
      GetEventQueryHandlerService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
