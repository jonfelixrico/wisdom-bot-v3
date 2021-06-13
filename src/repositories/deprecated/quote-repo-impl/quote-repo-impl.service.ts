// due to unknown reasons, import random from 'random' returns undefined
// eslint-disable-next-line @typescript-eslint/no-var-requires
const random = require('random')

import { Inject, Injectable } from '@nestjs/common'
import { IQuote, QuoteRepository } from 'src/classes/quote-repository.abstract'
import { QuoteDbEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Repository } from 'typeorm'

function quoteEntToObject(quote: QuoteDbEntity): IQuote {
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

@Injectable()
export class QuoteRepoImplService extends QuoteRepository {
  constructor(
    @Inject('QUOTE_ENTITY')
    private quoteTr: Repository<QuoteDbEntity>,
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
}
