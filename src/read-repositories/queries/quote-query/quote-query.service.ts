import { Injectable } from '@nestjs/common'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Connection } from 'typeorm'

interface IChannelAndPendingCount {
  channelId: string
  count: number
}

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
    const query = this.conn
      .getRepository(QuoteTypeormEntity)
      .createQueryBuilder()
      .orderBy('RAND()')

    let result: QuoteTypeormEntity
    if (authorId) {
      result = await query
        .where(
          'acceptDt IS NOT NULL AND guildId = :guildId AND authorId = :authorId',
          {
            guildId,
            authorId,
          },
        )
        .getOne()
    } else {
      result = await query
        .where('acceptDt IS NOT NULL AND guildId = :guildId', { guildId })
        .getOne()
    }

    return result?.id ?? null
  }

  async getQuoteData(quoteId: string) {
    const quote = await this.conn
      .getRepository(QuoteTypeormEntity)
      .findOne({ id: quoteId })

    if (!quote) {
      return null
    }

    const { authorId, content, submitDt } = quote

    return {
      quoteId,
      content,
      authorId,
      year: submitDt.getFullYear(),
    }
  }

  /**
   * Retrieves the ids of channels with pending quotes left.
   * @param guildId The guild where to look for channels.
   * @returns
   */
  async getChannelIdsWithPendingQuotes(guildId: string) {
    const results = await this.conn
      .getRepository(QuoteTypeormEntity)
      .createQueryBuilder('quote')
      .select('quote.guildid')
      .addSelect('COUNT(*)', 'count')
      .groupBy('quote.channelId')
      .where('quote.guildId = :guildId', { guildId })
      .andWhere('quote.expiredAt >= NOW()')
      .andWhere('quote.approveDt IS NULL')
      .andWhere('quote.cancelDt IS NULL')
      .getRawMany<IChannelAndPendingCount>()

    return results
      .filter(({ count }) => !!count)
      .map(({ channelId }) => channelId)
  }

  /**
   * Retrieves information of pending quotes under a specified channel.
   * @param channelId The channel where to look for quotes.
   * @returns
   */
  async getPendingQuotesFromChannel(channelId: string) {
    const results = await this.conn
      .getRepository(QuoteTypeormEntity)
      .createQueryBuilder()
      .where('channelId = :channelId', { channelId })
      .andWhere('expiredAt >= NOW()')
      .andWhere('approveDt IS NULL')
      .andWhere('cancelDt IS NULL')
      .getMany()

    return results.map(
      ({
        id: quoteId,
        upvoteCount,
        upvoteEmoji,
        messageId,
        expireDt,
        submitDt,
      }) => {
        return {
          quoteId,
          upvoteCount,
          upvoteEmoji,
          messageId,
          expireDt,
          submitDt,
        }
      },
    )
  }
}
