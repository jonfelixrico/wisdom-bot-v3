import { Injectable } from '@nestjs/common'
import { QuoteRepository } from 'src/classes/quote-repository.abstract'
import { GuildRepoService } from 'src/discord/guild-repo/guild-repo.service'
import { ReactionListenerService } from '../reaction-listener/reaction-listener.service'
import { TextChannel } from 'discord.js'
import { QuoteRegeneratorService } from '../quote-regenerator/quote-regenerator.service'

@Injectable()
export class PendingQuoteMessageRecacherService {
  constructor(
    private guildRepo: GuildRepoService,
    private reactListener: ReactionListenerService,
    private quoteRepo: QuoteRepository,
    private regen: QuoteRegeneratorService,
  ) {}

  private async reCacheMessages(
    { messages }: TextChannel,
    messageIds: string[],
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

  async regenerateLostMessages(lost: string[] = []) {
    for (const messageId of lost) {
      try {
        // TODO make a bulk regenerateMessage maybe?
        await this.regen.regenerateMessage(messageId)
      } catch (e) {
        // TODO add better handling
        console.error(e)
      }
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
      .filter(({ messageId }) => !!messageId)
      .map(({ messageId }) => messageId)

    if (messageIds.length) {
      return
    }

    const { lost, found } = await this.reCacheMessages(channel, messageIds)

    // TODO call ApprovedQuoteAnnouncer
    console.debug(channelId, found)

    // TODO call PendingQuoteMessageRegenerator
    this.regenerateLostMessages(lost)
  }
}
