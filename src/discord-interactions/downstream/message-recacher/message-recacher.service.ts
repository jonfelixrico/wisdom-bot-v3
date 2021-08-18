import { Logger } from '@nestjs/common'
import {
  CommandBus,
  EventsHandler,
  IEventHandler,
  QueryBus,
} from '@nestjs/cqrs'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'
import {
  GuildChannelPendingQuotesQuery,
  IGuildChannelPendingQuotesQueryOutput,
} from 'src/queries/guild-channel-pending-quotes.query'
import {
  GuildChannelsWithPendingQuotesQuery,
  IGuildChannelsWithPendingQuotesQueryOutput,
} from 'src/queries/guild-channels-with-pending-quotes.query'
import { CatchUpFinishedEvent } from 'src/read-model-catch-up/catch-up-finished.event'

@EventsHandler(CatchUpFinishedEvent)
export class MessageRecacherService
  implements IEventHandler<CatchUpFinishedEvent>
{
  constructor(
    private logger: Logger,
    private queryBus: QueryBus,
    private helper: DiscordHelperService,
    private commandBus: CommandBus,
  ) {}

  async flagAsExpired(quoteId: string) {
    try {
      this.logger.verbose(
        `Sending command to flag ${quoteId} as expired.`,
        MessageRecacherService.name,
      )
      await this.commandBus.execute(
        new AcknowledgePendingQuoteExpirationCommand({ quoteId }),
      )
    } catch (e) {
      this.logger.error(
        `Error encountered while trying flag ${quoteId} as expired: ${e.message}`,
        e.stack,
        MessageRecacherService.name,
      )

      // error intentionally suppressed
    }
  }

  async fetch(guildId: string, channelId: string) {
    const quotes = (await this.queryBus.execute(
      new GuildChannelPendingQuotesQuery({
        guildId,
        channelId,
      }),
    )) as IGuildChannelPendingQuotesQueryOutput

    // TODO move this logic to another service
    const expired = quotes.filter(({ expireDt }) => expireDt < new Date())
    for (const { quoteId } of expired) {
      await this.flagAsExpired(quoteId)
    }

    const { helper, logger } = this

    const guild = await helper.getGuild(guildId)
    if (!guild || !guild.available) {
      logger.warn(
        `Cannot find guild ${guildId}. Aborted fetch.`,
        MessageRecacherService.name,
      )
      return
    }

    const [channel, permissions] =
      (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Cannot find channel ${channelId} @ guild ${guildId}. Aborted fetch.`,
        MessageRecacherService.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `No READ_MESSAGE_HISTORY access to channel ${channelId} @ guild ${guildId}. Aborted fetch.`,
        MessageRecacherService.name,
      )
    }

    const pendingWithMessage = quotes.filter(
      ({ expireDt, messageId }) => expireDt >= new Date() && messageId,
    )

    for (const { messageId, quoteId } of pendingWithMessage) {
      try {
        await helper.getMessage(guildId, channelId, messageId)

        logger.verbose(
          `Fetched message ${messageId} for quote ${quoteId}.`,
          MessageRecacherService.name,
        )
      } catch (e) {
        logger.error(
          `Fetching of message ${messageId} for quote ${quoteId} failed: ${e.message}`,
          e.stack,
          MessageRecacherService.name,
        )

        // error intentionally suppressed
      }
    }
  }

  async handle() {
    const guildChannels = (await this.queryBus.execute(
      new GuildChannelsWithPendingQuotesQuery(),
    )) as IGuildChannelsWithPendingQuotesQueryOutput

    from(guildChannels)
      .pipe(
        mergeMap(
          ({ guildId, channelId }) => this.fetch(guildId, channelId),
          10,
        ),
      )
      .subscribe()
  }
}
