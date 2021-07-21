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
      .createQueryBuilder()
      .select('channelId', 'channelId')
      .where('guildId = :guildId', { guildId })
      .andWhere('expireAckDt IS NULL')
      .andWhere('acceptDt IS NULL')
      .andWhere('cancelDt IS NULL')
      .groupBy('channelId')
      .having('COUNT(channelId) > 0')
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
      .andWhere('expireAckDt IS NULL')
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
      .createQueryBuilder()
      .select('guildId', 'guildId')
      .where('expireAckDt IS NULL')
      .andWhere('acceptDt IS NULL')
      .andWhere('cancelDt IS NULL')
      .groupBy('guildId')
      .having('COUNT(guildId) > 0')
      .getRawMany<{ guildId: string }>()

    return results.map(({ guildId }) => guildId)
  }

  async getPendingQuote(quoteId) {
    const result = await this.repo.findOne({ id: quoteId })

    if (!result) {
      return null
    }

    const { expireAckDt, acceptDt, cancelDt } = result
    if (expireAckDt || acceptDt || cancelDt) {
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
      submitterId,
      authorId,
      expireDt,
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
      submitterId,
      authorId,
    }
  }
}
