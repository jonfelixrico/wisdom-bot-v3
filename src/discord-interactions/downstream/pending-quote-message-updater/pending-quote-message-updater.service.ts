import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import { debounceTime, filter, groupBy, mergeMap } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'
import { PendingQuoteResponseGeneratorService } from '../../services/pending-quote-response-generator/pending-quote-response-generator.service'

const {
  PENDING_QUOTE_VOTE_WITHDRAWN,
  PENDING_QUOTE_VOTE_CASTED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
  QUOTE_SUBMITTED,
} = DomainEventNames

const UPDATABLE_EVENTS = new Set<string>([
  PENDING_QUOTE_VOTE_CASTED,
  PENDING_QUOTE_VOTE_WITHDRAWN,
  QUOTE_SUBMITTED,
])

// events that ends a quote's pending status
const DEAD_END_EVENTS = new Set<string>([
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
])

@Injectable()
export class PendingQuoteMessageUpdater implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private queryBus: QueryBus,
    private logger: Logger,
    private helper: DiscordHelperService,
    private responseGen: PendingQuoteResponseGeneratorService,
  ) {}

  private async refreshDisplayedMessage(quoteId: string) {
    const { logger, helper } = this

    logger.debug(
      `Updating message for quote ${quoteId}`,
      PendingQuoteMessageUpdater.name,
    )

    const pendingQuote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!pendingQuote) {
      logger.warn(
        `Attempted to update message for unknown quote ${quoteId}`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const { channelId, messageId, guildId } = pendingQuote

    const guild = await helper.getGuild(guildId)

    if (!guild.available) {
      logger.warn(
        `Guild ${guildId} is inaccessible. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const [channel, permissions] =
      (await helper.getTextChannelAndPermissions(guildId, channelId)) || []

    if (!channel) {
      logger.warn(
        `Channel ${channelId} not found. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    if (!permissions.has('READ_MESSAGE_HISTORY')) {
      logger.warn(
        `No history read rights for ${channelId}. Can't update.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const message = await helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      logger.warn(
        `Attempted cannot find message ${messageId} for quote ${quoteId}`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    if (!message.editable || message.deleted) {
      logger.warn(
        `Message ${messageId} can no longer be updated.`,
        PendingQuoteMessageUpdater.name,
      )
      return
    }

    const generatedResponse = await this.responseGen.formatResponse(
      pendingQuote,
    )

    await message.edit(generatedResponse)

    logger.verbose(
      `Updated the displayed message for quote ${quoteId}`,
      PendingQuoteMessageUpdater.name,
    )
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(
          ({ event }) =>
            UPDATABLE_EVENTS.has(event.eventName) ||
            DEAD_END_EVENTS.has(event.eventName),
        ),
        groupBy(({ event }) => event.aggregateId),
        mergeMap((e) => {
          return e.pipe(debounceTime(3000))
        }),
      )
      .subscribe(async ({ event }) => {
        if (DEAD_END_EVENTS.has(event.eventName)) {
          return
        }

        await this.refreshDisplayedMessage(event.aggregateId)
      })
  }
}
