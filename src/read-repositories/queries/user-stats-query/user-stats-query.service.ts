import { Injectable } from '@nestjs/common'
import { InteractionTypeormRepository } from 'src/typeorm/providers/interaction.typeorm-repository'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'

@Injectable()
export class UserStatsQueryService {
  constructor(
    private quoteRepo: QuoteTypeormRepository,
    private receiveRepo: ReceiveTypeormRepository,
    private interactionRepo: InteractionTypeormRepository,
  ) {}

  private async outgoingStats(guildId: string, userId: string) {
    const submittedQuotesCount = await this.quoteRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('submitterId = :userId', { userId })
      .getCount()

    const receivedQuoteCount = await this.receiveRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('userId = :userId', { userId })
      .getCount()

    const interactionQuoteCount = await this.interactionRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('userId = :userId', { userId })
      .getCount()

    return {
      receivesGiven: receivedQuoteCount,
      interactionsGiven: interactionQuoteCount,
      quotesSubmitted: submittedQuotesCount,
    }
  }

  private async incomingStats(guildId: string, userId: string) {
    const authoredQuotesCount = await this.quoteRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('authorId = :userId', { userId })
      .getCount()

    const quoteReceivesCount = await this.receiveRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('parentQuoteAuthorId = :userId', { userId })
      .getCount()

    const quoteInteractionsCount = await this.interactionRepo
      .createQueryBuilder()
      .where('guildId = :guildId', { guildId })
      .andWhere('parentQuoteAuthorId = :userId', { userId })
      .getCount()

    return {
      receivesReceived: quoteReceivesCount,
      quotesAuthored: authoredQuotesCount,
      interactionsReceived: quoteInteractionsCount,
    }
  }

  async getStats(guildId: string, userId: string) {
    return {
      ...(await this.incomingStats(guildId, userId)),
      ...(await this.outgoingStats(guildId, userId)),
    }
  }
}
