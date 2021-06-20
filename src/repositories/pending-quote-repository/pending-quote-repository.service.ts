import { Inject, Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Repository } from 'typeorm'

@Injectable()
export class PendingQuoteRepositoryService {
  constructor(
    @Inject('QUOTE_ENTITY') private repo: Repository<QuoteDbEntity>,
  ) {}

  async findById(quoteId: string): Promise<PendingQuote> {
    const quoteEnt = await this.repo
      .createQueryBuilder()
      .where('id = :quoteId AND expireDt IS NULL AND acceptDt IS NULL', {
        quoteId,
      })
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
