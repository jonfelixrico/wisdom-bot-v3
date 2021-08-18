import { Test, TestingModule } from '@nestjs/testing'
import { MessageRecacherService } from './message-recacher.service'

describe('MessageRecacherService', () => {
  let service: MessageRecacherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRecacherService],
    }).compile()

    service = module.get<MessageRecacherService>(MessageRecacherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
