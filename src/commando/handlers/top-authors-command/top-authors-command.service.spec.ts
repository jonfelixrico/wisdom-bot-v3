import { Test, TestingModule } from '@nestjs/testing'
import { TopAuthorsCommandService } from './top-authors-command.service'

describe('TopAuthorsCommandService', () => {
  let service: TopAuthorsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopAuthorsCommandService],
    }).compile()

    service = module.get<TopAuthorsCommandService>(TopAuthorsCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
