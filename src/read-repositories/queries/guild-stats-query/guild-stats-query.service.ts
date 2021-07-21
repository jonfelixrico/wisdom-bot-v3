import { Injectable } from '@nestjs/common'
import { ReactionTypeormRepository } from 'src/typeorm/providers/reaction.typeorm-repository'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'

@Injectable()
export class GuildStatsQueryService {
  constructor(
    private quoteRepo: QuoteTypeormRepository,
    private receiveRepo: ReceiveTypeormRepository,
    private reactionRepo: ReactionTypeormRepository,
  ) {}

  async getStats(guildId: string) {
    const quotes = await this.quoteRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('acceptDt IS NOT NULL')
      .getCount()

    const receives = await this.receiveRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .getCount()

    const reactions = await this.reactionRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .getCount()

    return {
      quotes,
      receives,
      reactions,
    }
  }
}
