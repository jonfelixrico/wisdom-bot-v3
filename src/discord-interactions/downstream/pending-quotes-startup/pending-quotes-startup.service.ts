import { Injectable, OnModuleInit } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { CommandBus, EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import { from } from 'rxjs'
import { mergeMap, take } from 'rxjs/operators'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'
import { FetchMessagesCommand } from 'src/infrastructure/commands/fetch-messages.command'
import {
  GuildChannelPendingQuotesQuery,
  IGuildChannelPendingQuotesQueryOutput,
} from 'src/queries/guild-channel-pending-quotes.query'
import {
  GuildChannelsWithPendingQuotesQuery,
  IGuildChannelsWithPendingQuotesQueryOutput,
} from 'src/queries/guild-channels-with-pending-quotes.query'
import { CatchUpFinishedEvent } from 'src/read-model-catch-up/catch-up-finished.event'

@Injectable()
export class PendingQuotesStartupService implements OnModuleInit {
  constructor(
    private logger: Logger,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    private eventBus: EventBus,
  ) {}

  async flagAsExpired(quoteId: string) {
    try {
      this.logger.verbose(
        `Sending command to flag ${quoteId} as expired.`,
        PendingQuotesStartupService.name,
      )
      await this.commandBus.execute(
        new AcknowledgePendingQuoteExpirationCommand({ quoteId }),
      )
    } catch (e) {
      this.logger.error(
        `Error encountered while trying flag ${quoteId} as expired: ${e.message}`,
        e.stack,
        PendingQuotesStartupService.name,
      )

      // error intentionally suppressed
    }
  }

  private async fetch(guildId: string, channelId: string) {
    const { logger } = this

    logger.verbose(
      `Processing channel ${channelId} @ guild ${guildId}...`,
      PendingQuotesStartupService.name,
    )

    const quotes = (await this.queryBus.execute(
      new GuildChannelPendingQuotesQuery({
        guildId,
        channelId,
      }),
    )) as IGuildChannelPendingQuotesQueryOutput

    const expired = quotes.filter(({ expireDt }) => expireDt < new Date())
    for (const { quoteId } of expired) {
      await this.flagAsExpired(quoteId)
    }

    const messageIds = quotes
      .filter(({ expireDt, messageId }) => expireDt >= new Date() && messageId)
      .map(({ messageId }) => messageId)

    if (!messageIds.length) {
      logger.warn(
        `Skipped fetching messages for channel ${channelId} @ guild ${guildId}: no quotes with messages found`,
        PendingQuotesStartupService.name,
      )
      return
    }

    await this.commandBus.execute(
      new FetchMessagesCommand({
        guildId,
        channelId,
        messageIds,
      }),
    )

    logger.log(
      `Fetched messages for channel ${channelId} @ guild ${guildId}`,
      PendingQuotesStartupService.name,
    )
  }

  private async startProcess() {
    this.logger.log(
      'Starting pending quotes startup routine...',
      PendingQuotesStartupService.name,
    )

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
      .subscribe({
        complete: () => {
          this.logger.log(
            'Finished startup service...',
            PendingQuotesStartupService.name,
          )
        },
      })
  }

  onModuleInit() {
    this.eventBus
      .pipe(ofType(CatchUpFinishedEvent), take(1))
      .subscribe(() => this.startProcess())
  }
}
