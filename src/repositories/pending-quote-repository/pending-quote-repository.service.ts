import { Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Repository } from 'typeorm'

@Injectable()
export class PendingQuoteRepositoryService extends PendingQuoteRepository {
  constructor(private repo: Repository<QuoteDbEntity>) {
    super()
  }

  async findById(quoteId: string): Promise<PendingQuote> {
    const quoteEnt = await this.repo
      .createQueryBuilder()
      .where('id = :quoteId AND expireDt IS NULL AND acceptDt IS NULL')
      .getOne()

    if (!quoteEnt) {
      return null
    }

    const {
      approvalCount: upvoteCount,
      approvalEmoji: upvoteEmoji,
      approveDt: acceptDt,
      authorId,
      channelId,
      content,
      expireDt,
      guildId,
      messageId,
      submitDt,
      submitterId,
      cancelDt,
    } = quoteEnt

    return new PendingQuote({
      upvoteCount,
      upvoteEmoji,
      acceptDt,
      authorId,
      channelId,
      content,
      expireDt,
      guildId,
      messageId,
      submitterId,
      cancelDt,
      quoteId,
      submitDt,
    })
  }
}
