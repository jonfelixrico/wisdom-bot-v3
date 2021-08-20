import { Test, TestingModule } from '@nestjs/testing'
import { MessageRecacheRoutineService } from './message-recache-routine.service'

describe('MessageRecacheRoutineService', () => {
  let service: MessageRecacheRoutineService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageRecacheRoutineService],
    }).compile()

    service = module.get<MessageRecacheRoutineService>(
      MessageRecacheRoutineService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
