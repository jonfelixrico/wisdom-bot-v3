import { Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'
import { PendingQuoteRepository } from 'src/domain/pending-quote/pending-quote.repository'
import { IQuoteToSubmit } from 'src/domain/pending-quote/quote-to-submit.interface'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

function convertDbEntToDomainEnt({
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
  id: quoteId,
}: QuoteDbEntity) {
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

@Injectable()
export class PendingQuoteRepositoryService extends PendingQuoteRepository {
  constructor(private repo: Repository<QuoteDbEntity>) {
    super()
  }

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

    return convertDbEntToDomainEnt(quoteEnt)
  }

  async create({
    authorId,
    channelId,
    content,
    expireDt,
    guildId,
    messageId,
    submitDt,
    submitterId,
    upvoteCount,
    upvoteEmoji,
  }: IQuoteToSubmit): Promise<PendingQuote> {
    const ent = await this.repo.save({
      approvalCount: upvoteCount,
      approvalEmoji: upvoteEmoji,
      authorId,
      channelId,
      content,
      expireDt,
      guildId,
      id: v4(),
      messageId,
      submitDt,
      submitterId,
    })

    return convertDbEntToDomainEnt(ent)
  }
}
