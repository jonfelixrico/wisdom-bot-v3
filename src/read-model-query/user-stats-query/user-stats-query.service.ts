import { Injectable } from '@nestjs/common'
import { ReactionTypeormRepository } from 'src/typeorm/providers/reaction.typeorm-repository'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { ReceiveTypeormRepository } from 'src/typeorm/providers/receive.typeorm-repository'
import { IsNull, Not } from 'typeorm'

@Injectable()
export class UserStatsQueryService {
  constructor(
    private quoteRepo: QuoteTypeormRepository,
    private receiveRepo: ReceiveTypeormRepository,
    private reactionRepo: ReactionTypeormRepository,
  ) {}

  private async outgoingStats(guildId: string, userId: string) {
    const submittedQuotesCount = await this.quoteRepo.count({
      where: {
        guildId,
        submitterId: userId,
        acceptDt: Not(IsNull()),
      },
    })

    const receiveCount = await this.receiveRepo.count({
      where: {
        guildId,
        userId,
      },
    })

    const reactionCount = await this.reactionRepo.count({
      where: {
        guildId,
        userId,
      },
    })

    return {
      receiveCount,
      reactionCount,
      quotesSubmitted: submittedQuotesCount,
    }
  }

  private async incomingStats(guildId: string, userId: string) {
    const authoredQuotes = await this.quoteRepo.count({
      where: {
        guildId,
        authorId: userId,
        acceptDt: Not(IsNull()),
      },
    })

    const timesReceived = await this.receiveRepo.count({
      where: {
        guildId,
        parentQuoteAuthorId: userId,
      },
    })

    const timesReactedTo = await this.reactionRepo.count({
      where: {
        guildId,
        parentQuoteAuthorId: userId,
      },
    })

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
