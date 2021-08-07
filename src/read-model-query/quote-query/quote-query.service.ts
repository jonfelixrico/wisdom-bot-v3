import { Injectable } from '@nestjs/common'
import { random } from 'lodash'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { Connection, FindConditions, IsNull, Not } from 'typeorm'

@Injectable()
export class QuoteQueryService {
  constructor(private conn: Connection) {}

  /**
   * Finds the id of the quote assocaited with the `messageId`
   * @param messageId
   * @returns Null if no associated quote was found; the id of the quote if otherwise.
   */
  async getQuoteIdFromMessageId(messageId: string) {
    const matchingQuote = await this.conn
      .getRepository(QuoteTypeormEntity)
      .findOne({
        messageId,
      })

    if (!matchingQuote) {
      return null
    }

    return matchingQuote.id
  }

  /**
   * Gets the id of a random approved quote. If no quotes that matches the `guildId` and `authorId` criteria were found,
   * then null will be returned.
   *
   * @param guildId
   * @param authorId Optional.
   * @returns Null if no quotes were found, else the id of a quote will be returned instead.
   */
  async getRandomQuoteId(guildId: string, authorId?: string) {
    const findOptions: FindConditions<QuoteTypeormEntity> = {
      acceptDt: Not(IsNull()),
      guildId,
    }

    if (authorId) {
      findOptions.authorId = authorId
    }

    const repo = this.conn.getRepository(QuoteTypeormEntity)

    const count = await repo.count({
      where: findOptions,
    })

    if (!count) {
      return null
    }

    const [found] = await repo.find({
      where: findOptions,
      take: 1,
      skip: random(0, count - 1, false),
    })

    return found?.id ?? null
  }

  async getQuoteData(quoteId: string) {
    const quote = await this.conn
      .getRepository(QuoteTypeormEntity)
      .findOne({ id: quoteId })

    if (!quote) {
      return null
    }

    const receiveCount = await this.conn
      .getRepository(ReceiveTypeormEntity)
      .count({ quoteId })

    const {
      authorId,
      content,
      submitDt,
      guildId,
      channelId,
      messageId,
      submitterId,
    } = quote

    return {
      quoteId,
      content,
      authorId,
      year: submitDt.getFullYear(),
      guildId,
      channelId,
      messageId,
      submitterId,
      submitDt,
      receiveCount,
    }
  }
}
