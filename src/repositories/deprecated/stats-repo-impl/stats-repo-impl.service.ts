import { Inject, Injectable } from '@nestjs/common'
import {
  IQuoteStats,
  StatsRepository,
} from 'src/classes/stats-repository.abstract'
import { ConcurDbEntity } from 'src/typeorm/entities/concur.typeorm-entity'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { ReceiveDbEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { Repository } from 'typeorm'

@Injectable()
export class StatsRepoImplService extends StatsRepository {
  constructor(
    @Inject('QUOTE_ENTITY')
    private quoteTr: Repository<QuoteDbEntity>,
    @Inject('CONCUR_ENTITY')
    private concurTr: Repository<ConcurDbEntity>,
    @Inject('RECEIVE_ENTITY') private receiveTr: Repository<ReceiveDbEntity>,
  ) {
    super()
  }

  async getSubmittedQuoteStats(
    userId: string,
    guildId: string,
  ): Promise<IQuoteStats> {
    const quotes = await this.quoteTr
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.receives', 'receive')
      .leftJoinAndSelect('receive.concurs', 'concur')
      .where('quote.authorId = :userId AND quote.guildId = :guildId', {
        userId,
        guildId,
      })
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

  async getPersonalQuoteStats(
    userId: string,
    guildId: string,
  ): Promise<IQuoteStats> {
    return {
      quotes: await this.quoteTr.count({ submitterId: userId, guildId }),
      receives: await this.receiveTr.count({ userId, guildId }),
      concurs: await this.concurTr.count({ userId, guildId }),
    }
  }
}
