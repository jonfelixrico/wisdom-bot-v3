import { Injectable } from '@nestjs/common'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'

@Injectable()
export class PendingQuoteQueryService {
  constructor(private repo: QuoteTypeormRepository) {}

  /**
   * Retrieves the ids of channels with pending quotes left.
   * @param guildId The guild where to look for channels.
   * @returns
   */
  async getChannelIdsWithPendingQuotes(guildId: string) {
    const results = await this.repo
      .createQueryBuilder('quote')
      .select('quote.channelId', 'channelId')
      .where('quote.guildId = :guildId', { guildId })
      .andWhere('quote.expireDt >= :now', { now: new Date() })
      .andWhere('quote.acceptDt IS NULL')
      .andWhere('quote.cancelDt IS NULL')
      .groupBy('quote.channelId')
      .having('COUNT(quote.channelId)')
      .getRawMany<{ channelId: string }>()

    return results.map(({ channelId }) => channelId)
  }

  /**
   * Retrieves information of pending quotes under a specified channel.
   * @param channelId The channel where to look for quotes.
   * @returns
   */
  async getPendingQuotesFromChannel(channelId: string) {
    const results = await this.repo
      .createQueryBuilder()
      .where('channelId = :channelId', { channelId })
      .andWhere('expireDt >= :now', { now: new Date() })
      .andWhere('acceptDt IS NULL')
      .andWhere('cancelDt IS NULL')
      .getMany()

    return results.map(
      ({ id: quoteId, upvoteCount, upvoteEmoji, messageId, expireDt }) => {
        return {
          quoteId,
          upvoteCount,
          upvoteEmoji,
          messageId,
          expireDt,
        }
      },
    )
  }

  /**
   * Retrieves the list of guilds with pending quotes.
   * @returns Array of guild ids with pending quotes.
   */
  async getGuildsWithPendingQuotes() {
    const results = await this.repo
      .createQueryBuilder('quote')
      .select('quote.guildId', 'guildId')
      .where('quote.expireDt >= :now', { now: new Date() })
      .andWhere('quote.acceptDt IS NULL')
      .andWhere('quote.cancelDt IS NULL')
      .groupBy('quote.guildId')
      .having('COUNT(quote.guildId)')
      .getRawMany<{ guildId: string }>()

    return results.map(({ guildId }) => guildId)
  }

  async getPendingQuote(quoteId) {
    const result = await this.repo.findOne({ id: quoteId })

    if (!result) {
      return null
    }

    const { expireDt, acceptDt, cancelDt } = result
    if (new Date() > expireDt || acceptDt || cancelDt) {
      return null
    }

    const {
      messageId,
      channelId,
      guildId,
      content,
      submitDt,
      upvoteCount,
      upvoteEmoji,
    } = result

    return {
      messageId,
      channelId,
      guildId,
      content,
      submitDt,
      upvoteCount,
      upvoteEmoji,
      quoteId,
      expireDt,
    }
  }
}
