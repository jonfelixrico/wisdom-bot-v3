import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import { filter, map } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'

@Injectable()
export class QuoteAcceptedAnnouncerService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private queryBus: QueryBus,
    private helper: DiscordHelperService,
  ) {}

  private async handle(quoteId: string) {
    const { logger, helper } = this

    const quote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!quote) {
      logger.warn(`Unkown quote ${quoteId}`, QuoteAcceptedAnnouncerService.name)
      return
    } else if (quote.upvoteCount <= 0) {
      logger.debug(
        `Skipped quote ${quoteId} because it has no required upvoteCount.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    const { guildId, channelId, messageId } = quote

    const guild = await helper.getGuild(guildId)
    if (!guild.available) {
      logger.warn(
        `Can't announce in guild ${guildId} because we have no permissions.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    const [channel, permissions] =
      (await this.helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Cant find channel ${channelId} of guild ${guildId}.`,
        QuoteAcceptedAnnouncerService.name,
      )
    }

    if (permissions.has('SEND_MESSAGES')) {
      // TODO send actual content here
      await channel.send('test')
      logger.log(
        `Announced acceptance of quote ${quoteId} in guild ${guildId} channel ${channelId}`,
        QuoteAcceptedAnnouncerService.name,
      )
    } else {
      logger.warn(
        `Can't announce acceptance of quote ${quoteId} in guild ${guildId} channel ${channelId} because we have no SEND_MESSAGES permission.`,
        QuoteAcceptedAnnouncerService.name,
      )
    }

    if (!messageId) {
      logger.verbose(
        `No message associated with ${quoteId}; skipping cleanup phase.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `Can't clean up pending quote message of ${quoteId} in guild ${guildId} channel ${channelId} because we have no READ_MESSAGE_HISTORY permission.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    const message = await helper.getMessage(guildId, channelId, messageId)

    if (!message) {
      logger.warn(
        `Message ${messageId} not found.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    if (!permissions.has('MANAGE_MESSAGES')) {
      logger.warn(
        `Can't clean up pending quote message of ${quoteId} in guild ${guildId} channel ${channelId} because we have no MANAGE_MESSAGES permission.`,
        QuoteAcceptedAnnouncerService.name,
      )
      return
    }

    await message.delete()
    logger.log(
      `Cleaned up message ${messageId} due to ${quoteId} being accepted.`,
      QuoteAcceptedAnnouncerService.name,
    )
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(
          ({ event }) =>
            event.eventName === DomainEventNames.PENDING_QUOTE_ACCEPTED,
        ),
        map(({ event }) => event.aggregateId),
      )
      .subscribe(this.handle.bind(this))
  }
}
