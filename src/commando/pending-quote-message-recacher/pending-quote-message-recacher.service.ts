import { Injectable } from '@nestjs/common'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { TextChannel } from 'discord.js'

@Injectable()
export class PendingQuoteMessageRecacherService {
  constructor(
    private guildRepo: GuildRepoService,
    private reactListener: ReactionListenerService,
    private quoteRepo: QuoteRepository,
  ) {}

  private async reCacheMessages(
    { messages }: TextChannel,
    ...messageIds: string[]
  ) {
    const found = []
    const lost = []

    for (const messageId of messageIds) {
      const message = await messages.fetch(messageId)
      if (!message) {
        lost.push(messageId)
      } else {
        found.push(messageId)
      }
    }

    return {
      found,
      lost,
    }
  }

  private async cachePendingQuoteMessages(guildId: string, channelId: string) {
    const channel = await this.guildRepo.getTextChannel(guildId, channelId)

    if (!channel) {
      console.warn('Text channel not found.')
      return
    }

    const quotes = await this.quoteRepo.getChannelPendingQuotes(channelId)
    const messageIds = quotes
      .map(({ messageId }) => messageId)
      .filter((id) => !!id)

    if (!messageIds.length) {
      return
    }

    const { lost, found } = await this.reCacheMessages(channel, ...messageIds)

    // TODO call ApprovedQuoteAnnouncer
    console.debug(channelId, found)

    // TODO call PendingQuoteMessageRegenerator
    console.debug(channelId, lost)
  }
}
