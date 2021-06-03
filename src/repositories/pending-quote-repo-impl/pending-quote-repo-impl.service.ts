import { Inject, Injectable } from '@nestjs/common'
import {
  IPendingQuote,
  IPendingQuoteOverview,
  ISubmittedQuote,
  PendingQuoteRepository,
} from 'src/classes/pending-quote-repository.abstract'
import { Quote } from 'src/typeorm/entities/quote.entity'
import { Repository } from 'typeorm'

function submittedQuoteObjToEnt({
  approvalCount,
  approvalEmoji,
  authorId,
  channelId,
  content,
  expireDt,
  guildId,
  messageId,
  submitDt,
  submitterId,
}: ISubmittedQuote) {
  const ent = new Quote()
  ent.approvalCount = approvalCount
  ent.approvalEmoji = approvalEmoji
  ent.authorId = authorId
  ent.channelId = channelId
  ent.content = content
  ent.expireDt = expireDt
  ent.guildId = guildId
  ent.messageId = messageId
  ent.submitDt = submitDt
  ent.submitterId = submitterId

  return ent
}

function pendingQuoteEntToObj({
  content,
  authorId,
  submitterId,
  guildId,
  channelId,
  messageId,
  submitDt,
  id,
  approvalEmoji,
  approvalCount,
  expireDt,
}: Quote): IPendingQuote {
  return {
    content,
    authorId,
    submitterId,
    submitDt,
    guildId,
    channelId,
    expireDt,
    messageId,
    quoteId: id,
    approvalEmoji,
    approvalCount,
  }
}

@Injectable()
export class PendingQuoteRepoImplService extends PendingQuoteRepository {
  constructor(
    @Inject('QUOTE_ENTITY')
    private quoteTr: Repository<Quote>,
  ) {
    super()
  }

  async createPendingQuote(quote: ISubmittedQuote): Promise<IPendingQuote> {
    const quoteEnt = await this.quoteTr.save(submittedQuoteObjToEnt(quote))

    return pendingQuoteEntToObj(quoteEnt)
  }

  async getPendingQuotesByChannelId(
    channelId: string,
  ): Promise<IPendingQuote[]> {
    const quoteEnts = await this.quoteTr
      .createQueryBuilder()
      .where(
        'channelId = :channelId AND approveDt IS NULL AND expireDt >= :now',
        {
          channelId,
          now: new Date(),
        },
      )
      .getMany()

    return quoteEnts.map(pendingQuoteEntToObj)
  }

  async getPendingQuote(quoteId: string): Promise<IPendingQuote> {
    const quoteEnt = await this.quoteTr
      .createQueryBuilder()
      .where('id = :quoteId AND approveDt IS NOT NULL AND expireDt >= :now', {
        quoteId,
        now: new Date(),
      })
      .getOne()

    return quoteEnt && pendingQuoteEntToObj(quoteEnt)
  }

  async getPendingQuoteByMessageId(messageId: string): Promise<IPendingQuote> {
    const quoteEnt = await this.quoteTr
      .createQueryBuilder()
      .where(
        'messageId = :messageId AND approveDt IS NOT NULL AND expireDt >= :now',
        { messageId, now: new Date() },
      )
      .getOne()

    return quoteEnt && pendingQuoteEntToObj(quoteEnt)
  }

  async approvePendingQuote(
    quoteId: string,
    approveDt?: Date,
  ): Promise<boolean> {
    const { affected } = await this.quoteTr.update(
      {
        id: quoteId,
      },
      {
        approveDt: approveDt || new Date(),
      },
    )

    return affected > 0
  }

  async getPendingQuoteOverview(): Promise<IPendingQuoteOverview> {
    const res = await this.quoteTr
      .createQueryBuilder()
      .select('DISTINCT guildId, channelId')
      .where('approveDt IS NULL AND expireDt >= :now', { now: new Date() })
      .getRawMany<{ guildId: string; channelId: string }>()
    // TODO place this in a separate interface

    return res.reduce((map, { guildId, channelId }) => {
      if (!map[guildId]) {
        map[guildId] = []
      }

      map[guildId].push(channelId)

      return map
    }, {})
  }

  async updateMessageId(quoteId: string, messageId: string): Promise<boolean> {
    const { affected } = await this.quoteTr.update(
      {
        id: quoteId,
      },
      { messageId },
    )

    return affected > 0
  }
}
