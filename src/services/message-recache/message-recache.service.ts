import { Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Client, Guild, TextChannel } from 'discord.js'
import { PendingQuoteQueryService } from 'src/read-repositories/queries/pending-quote-query/pending-quote-query.service'

@Injectable()
export class MessageRecacheService implements OnApplicationBootstrap {
  constructor(
    private client: Client,
    private query: PendingQuoteQueryService,
    private commandBus: CommandBus,
    private logger: Logger,
  ) {}

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

  private async processChannelMessages(
    channel: TextChannel,
    messageDataArr: { messageId: string; quoteId: string }[],
  ) {
    for (const { messageId, quoteId } of messageDataArr) {
      try {
        const discordMessage = await channel.messages.fetch(messageId)
      } catch (e) {
        this
      }
    }
  }

  private async processGuildChannelIds(guild: Guild, channelIds: string[]) {
    for (const channelId of channelIds) {
      const channel = guild.channels.cache.get(channelId) as TextChannel | null

      if (!channel) {
        this.logWarn(
          `Skipped channel ${channel.id} because it's not a text channel.`,
        )
        return
      }

      const messageDataArr = await this.query.getPendingQuotesFromChannel(
        channel.id,
      )

      await this.processChannelMessages(
        channel,
        messageDataArr.sort(
          (a, b) => a.submitDt.getTime() - b.submitDt.getTime(),
        ),
      )
    }
  }

  async onApplicationBootstrap() {
    const guilds = this.client.guilds
    const guildIds = await this.query.getGuildsWithPendingQuotes()

    for (const guildId of guildIds) {
      try {
        const guild = await guilds.fetch(guildId)

        if (!guild.available) {
          this.logWarn(
            `Skipped guild ${guild.id} because the bot lacks access.`,
          )
          return
        }

        const channelIds = await this.query.getChannelIdsWithPendingQuotes(
          guildId,
        )

        this.processGuildChannelIds(guild, channelIds)
      } catch (e) {
        this.logError(e)
      }
    }
  }
}
