import { Injectable } from '@nestjs/common'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { Connection } from 'typeorm'

interface IChannelAndPendingCount {
  channelId: string
  count: number
}

@Injectable()
export class PendingQuoteQueryService {
  constructor(private conn: Connection) {}

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
