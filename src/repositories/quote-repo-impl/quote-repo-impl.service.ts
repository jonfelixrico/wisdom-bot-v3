// due to unknown reasons, import random from 'random' returns undefined
// eslint-disable-next-line @typescript-eslint/no-var-requires
const random = require('random')

import { Inject, Injectable } from '@nestjs/common'
import {
  IGuildsAndChannelsWithPendingQuotes,
  INewQuote,
  IPendingQuote,
  IQuote,
  QuoteRepository,
} from 'src/classes/quote-repository.abstract'
import { Approval } from 'src/typeorm/entities/approval.entity'
import { Quote } from 'src/typeorm/entities/quote.entity'
import { Connection, Repository } from 'typeorm'

function quoteEntToObject(quote: Quote): IQuote {
  const {
    id: quoteId,
    content,
    messageId,
    authorId,
    submitterId,
    guildId,
    channelId,
    submitDt,
  } = quote

  return {
    quoteId,
    content,
    messageId,
    authorId,
    submitterId,
    guildId,
    channelId,
    submitDt,
  }
}

function pendingQuoteEntToObj(quote: Quote): IPendingQuote {
  const base = quoteEntToObject(quote)
  const { expireDt, approveDt, requiredApprovalCount } = quote

  return {
    expireDt,
    approveDt,
    requiredApprovalCount,
    approvers: [],
    ...base,
  }
}

@Injectable()
export class QuoteRepoImplService extends QuoteRepository {
  constructor(
    @Inject('QUOTE_ENTITY')
    private quoteTr: Repository<Quote>,
    @Inject('APPROVAL_ENTITY')
    private connection: Connection,
  ) {
    super()
  }

  async getQuote(quoteId: string): Promise<IQuote> {
    const quote = await this.quoteTr
      .createQueryBuilder()
      .where('id = :quoteId AND approveDt IS NOT NULL', { quoteId })
      .getOne()

    return quote ? quoteEntToObject(quote) : null
  }

  async getRandomQuote(guildId: string, authorId?: string): Promise<IQuote> {
    const queryBuilder = this.quoteTr.createQueryBuilder()

    if (!authorId) {
      queryBuilder.where('guildId = :guildId AND approveDt IS NOT NULL', {
        guildId,
      })
    } else {
      queryBuilder.where(
        'guildId = :guildId AND authorId = :authorId AND approveDt IS NOT NULL',
        { guildId, authorId },
      )
    }

    const quotes = await queryBuilder.getMany()

    if (!quotes.length) {
      return null
    }

    const idx = random.int(0, quotes.length - 1)
    return quoteEntToObject(quotes[idx])
  }

  async createQuote({
    submitDt,
    ...others
  }: INewQuote): Promise<IPendingQuote> {
    const quote = this.quoteTr.create({
      ...others,
      submitDt: submitDt || new Date(),
    })
    await this.quoteTr.save(quote)
    return await pendingQuoteEntToObj(quote)
  }

  async getChannelPendingQuotes(channelId: string): Promise<IPendingQuote[]> {
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

    return quoteEnts.map((ent) => pendingQuoteEntToObj(ent))
  }

  async getPendingQuote(quoteId: string): Promise<IPendingQuote> {
    const quote = await this.quoteTr
      .createQueryBuilder()
      .where('id = :quoteId AND approveDt IS NULL AND expireDt >= :now', {
        quoteId,
        now: new Date(),
      })
      .getOne()

    return quote ? await pendingQuoteEntToObj(quote) : null
  }

  addApprover(quoteId: string, userId: string): Promise<IPendingQuote> {
    return this.connection.transaction(async (manager) => {
      const quote = await manager.findOne(Quote, {
        id: quoteId,
      })

      const approval = await manager.create(Approval, {
        quote: Promise.resolve(quote),
        approveDt: new Date(),
        userId,
      })

      const existingApprovals = await quote.approvals

      await manager.save(approval)
      quote.approvals = Promise.resolve([...existingApprovals, approval])

      if (existingApprovals.length + 1 >= quote.requiredApprovalCount) {
        quote.approveDt = new Date()
        await manager.save(quote)
      }

      return await pendingQuoteEntToObj(quote)
    })
  }

  async setApproveDt(quoteId: string, approveDt?: Date): Promise<boolean> {
    const updateResult = await this.quoteTr.update(
      {
        id: quoteId,
      },
      {
        approveDt: approveDt || new Date(),
      },
    )

    return updateResult.affected > 0
  }

  async getIdsOfGuildsAndChannelsWithPendingQuotes(): Promise<IGuildsAndChannelsWithPendingQuotes> {
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

  async getPendingQuoteByMessageId(messageId: string): Promise<IPendingQuote> {
    const pendingQuote = await this.quoteTr.findOne({ messageId })
    return pendingQuote ? pendingQuoteEntToObj(pendingQuote) : null
  }

  async setMessageId(quoteId: string, messageId: string): Promise<boolean> {
    const { affected } = await this.quoteTr.update(
      {
        id: quoteId,
      },
      { messageId },
    )

    return affected > 0
  }
}
