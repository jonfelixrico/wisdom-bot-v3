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
  ) {
    this.setUp()
  }

  private async setUp() {
    const map =
      await this.quoteRepo.getIdsOfGuildsAndChannelsWithPendingQuotes()

    console.debug(map)

    const entries = Object.entries(map)

    for (const [guildId, channelIds] of entries) {
      for (const channelId of channelIds) {
        await this.cachePendingQuoteMessages(guildId, channelId)
      }
    }
  }

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

  private async regenerateLostMessages(lost: string[] = []) {
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

  private rewatchFoundMessages(found: string[] = []) {
    // TODO stop using a dummy expireDt
    const expireDt = new Date()
    expireDt.setMinutes(expireDt.getMinutes() + 2)
    for (const messageId of found) {
      this.reactListener.watch(messageId, '🤔', 1, expireDt)
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

    if (!messageIds.length) {
      return
    }

    const { lost, found } = await this.reCacheMessages(channel, messageIds)

    // TODO call ApprovedQuoteAnnouncer
    this.rewatchFoundMessages(found)

    // TODO call PendingQuoteMessageRegenerator
    this.regenerateLostMessages(lost)
  }
}
