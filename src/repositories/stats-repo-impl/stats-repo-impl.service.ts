import { Injectable } from '@nestjs/common'
import {
  IQuoteStats,
  StatsRepository,
} from 'src/classes/stats-repository.abstract'

@Injectable()
export class StatsRepoImplService extends StatsRepository {
  getSubmittedQuoteStats(userId: string): Promise<IQuoteStats> {
    throw new Error('Method not implemented.')
  }
  getAuthoredQuoteStats(userId: string): Promise<IQuoteStats> {
    throw new Error('Method not implemented.')
  }
}
