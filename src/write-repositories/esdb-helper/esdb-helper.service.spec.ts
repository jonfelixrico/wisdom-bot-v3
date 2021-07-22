import { Test, TestingModule } from '@nestjs/testing'
import { EsdbHelperService } from './esdb-helper.service'

describe('EsdbHelperService', () => {
  let service: EsdbHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsdbHelperService],
    }).compile()

    service = module.get<EsdbHelperService>(EsdbHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
