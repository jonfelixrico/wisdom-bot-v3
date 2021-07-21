import { Injectable } from '@nestjs/common'
import { ReactionTypeormRepository } from 'src/typeorm/providers/reaction.typeorm-repository'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'

@Injectable()
export class UserStatsQueryService {
  constructor(
    private quoteRepo: QuoteTypeormRepository,
    private receiveRepo: ReceiveTypeormRepository,
    private reactionRepo: ReactionTypeormRepository,
  ) {}

  private async outgoingStats(guildId: string, userId: string) {
    const submittedQuotesCount = await this.quoteRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('submitterId = :userId', { userId })
      .andWhere('acceptDt IS NOT NULL')
      .getCount()

    const receiveCount = await this.receiveRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('userId = :userId', { userId })
      .getCount()

    const reactionCount = await this.reactionRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('userId = :userId', { userId })
      .getCount()

    return {
      receiveCount,
      reactionCount,
      quotesSubmitted: submittedQuotesCount,
    }
  }

  private async incomingStats(guildId: string, userId: string) {
    const authoredQuotes = await this.quoteRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('authorId = :userId', { userId })
      .andWhere('acceptDt IS NOT NULL')
      .getCount()

    const timesReceived = await this.receiveRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('parentQuoteAuthorId = :userId', { userId })
      .getCount()

    const timesReactedTo = await this.reactionRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('parentQuoteAuthorId = :userId', { userId })
      .getCount()

    return {
      timesReceived,
      authoredQuotes,
      timesReactedTo,
    }
  }

  async getStats(guildId: string, userId: string) {
    return {
      ...(await this.incomingStats(guildId, userId)),
      ...(await this.outgoingStats(guildId, userId)),
    }
  }
}
