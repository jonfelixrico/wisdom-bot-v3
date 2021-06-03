import { Inject, Injectable } from '@nestjs/common'
import {
  IQuoteStats,
  StatsRepository,
} from 'src/classes/stats-repository.abstract'
import { Concur } from 'src/typeorm/entities/concur.entity'
import { Quote } from 'src/typeorm/entities/quote.entity'
import { Receive } from 'src/typeorm/entities/receive.entity'
import { Repository } from 'typeorm'

@Injectable()
export class StatsRepoImplService extends StatsRepository {
  constructor(
    @Inject('QUOTE_ENTITY')
    private quoteTr: Repository<Quote>,
    @Inject('CONCUR_ENTITY')
    private concurTr: Repository<Concur>,
    @Inject('RECEIVE_ENTITY') private receiveTr: Repository<Receive>,
  ) {
    super()
  }

  async getSubmittedQuoteStats(userId: string): Promise<IQuoteStats> {
    const quotes = await this.quoteTr
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.receives', 'receive')
      .leftJoinAndSelect('receive.concurs', 'concur')
      .where('quote.authorId = :userId', { userId })
      .getMany()

    const stats: IQuoteStats = {
      concurs: 0,
      quotes: 0,
      receives: 0,
    }

    stats.quotes = quotes.length

    for (const { receives: pReceive } of quotes) {
      const receives = await pReceive

      stats.receives += receives.length

      for (const { concurs: pConcurs } of receives) {
        const concurs = await pConcurs
        stats.concurs += concurs.length
      }
    }

    return stats
  }

  async getPersonalQuoteStats(userId: string): Promise<IQuoteStats> {
    return {
      quotes: await this.quoteTr.count({ submitterId: userId }),
      receives: await this.receiveTr.count({ userId }),
      concurs: await this.concurTr.count({ userId }),
    }
  }
}
