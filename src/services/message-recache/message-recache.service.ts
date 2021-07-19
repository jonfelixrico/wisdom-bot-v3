import { Injectable, Logger } from '@nestjs/common'
import { CommandBus, EventBus, ofType } from '@nestjs/cqrs'
import { TextChannel } from 'discord.js'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { RegeneratePendingQuoteMessageCommand } from 'src/infrastructure/commands/regenerate-pending-quote-message.command'
import { WatchPendingQuoteCommand } from 'src/infrastructure/commands/watch-pending-quote.command'
import { CatchUpFinishedEvent } from 'src/read-repositories/catch-up-finsihed.event'
import { PendingQuoteQueryService } from 'src/read-repositories/queries/pending-quote-query/pending-quote-query.service'

@Injectable()
export class MessageRecacheService {
  constructor(
    private discordHelper: DiscordHelperService,
    private query: PendingQuoteQueryService,
    private commandBus: CommandBus,
    private logger: Logger,
    private eventBus: EventBus,
  ) {
    this.eventBus
      .pipe(ofType(CatchUpFinishedEvent))
      .subscribe(this.handle.bind(this))
  }

  async handle() {
    this.logger.log('Starting message recache.', MessageRecacheService.name)

    const guildIds = await this.query.getGuildsWithPendingQuotes()

    for (const guildId of guildIds) {
      try {
        const guild = await this.discordHelper.getGuild(guildId)
        // TODO add error handling

        // Check if we have access to the guild
        if (!guild.available) {
          this.logWarn(
            `Skipped guild ${guild.id} because the bot lacks access.`,
          )
          return
        }

        this.processGuild(guildId)
      } catch (e) {
        this.logError(e)
      }
    }

    this.logger.log('Finished recaching messages.', MessageRecacheService.name)
  }

  private logError(error: Error, message?: string) {
    this.logger.error(
      message ?? error.message,
      error.stack,
      MessageRecacheService.name,
    )
  }

  private logWarn(message: string) {
    this.logger.warn(message, MessageRecacheService.name)
  }

  private async processChannelMessages({ guild, ...channel }: TextChannel) {
    const messageData = await this.query.getPendingQuotesFromChannel(channel.id)

    for (const {
      messageId,
      quoteId,
      upvoteCount,
      upvoteEmoji,
      expireDt,
    } of messageData) {
      const message = await this.discordHelper.getMessage(
        guild.id,
        channel.id,
        messageId,
      )
      // TODO add error handling

      const { commandBus } = this

      if (!message) {
        await commandBus.execute(
          new RegeneratePendingQuoteMessageCommand({
            quoteId,
          }),
        )
        return
      } else {
        await commandBus.execute(
          new WatchPendingQuoteCommand({
            message,
            quoteId,
            expireDt,
            upvoteCount,
            upvoteEmoji,
          }),
        )
      }
    }
  }

  async processGuild(guildId: string) {
    const channelIds = await this.query.getChannelIdsWithPendingQuotes(guildId)
    for (const channelId of channelIds) {
      // We're retrieving the channel just to check if it still exists
      const channel = await this.discordHelper.getTextChannel(
        guildId,
        channelId,
      )
      // TODO add error handling

      if (!channel) {
        // TODO log warn that the channel is not found
        return
      }

      // TODO permissions checking here maybe?

      this.processChannelMessages(channel)
    }
  }
}
