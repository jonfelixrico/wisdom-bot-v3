import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, ofType, QueryBus } from '@nestjs/cqrs'
import { debounceTime, filter, groupBy, map, mergeMap } from 'rxjs/operators'
import { DiscordHelperService } from 'src/discord/discord-helper/discord-helper.service'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  IPendingQuoteQueryOutput,
  PendingQuoteQuery,
} from 'src/queries/pending-quote.query'
import { ReadModelSyncedEvent } from 'src/read-model-catch-up/read-model-synced.event'
import { PendingQuoteResponseGeneratorService } from '../pending-quote-response-generator/pending-quote-response-generator.service'

const {
  PENDING_QUOTE_VOTE_WITHDRAWN: PEDNING_QUOTE_VOTE_WITHDRAWN,
  PENDING_QUOTE_VOTE_CASTED,
} = DomainEventNames

const TARGET_EVENTS = new Set<string>([
  PENDING_QUOTE_VOTE_CASTED,
  PEDNING_QUOTE_VOTE_WITHDRAWN,
])

@Injectable()
export class PendingQuoteVoteChangeMessageUpdaterService
  implements OnModuleInit
{
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
      PendingQuoteVoteChangeMessageUpdaterService.name,
    )

    const pendingQuote = (await this.queryBus.execute(
      new PendingQuoteQuery({ quoteId }),
    )) as IPendingQuoteQueryOutput

    if (!pendingQuote) {
      logger.warn(
        `Attempted to update message for unknown quote ${quoteId}`,
        PendingQuoteVoteChangeMessageUpdaterService.name,
      )
      return
    }

    const { channelId, messageId, guildId } = pendingQuote

    const message = await helper.getMessage(guildId, channelId, messageId)
    if (!message) {
      logger.warn(
        `Attempted cannot find message ${messageId} for quote ${quoteId}`,
        PendingQuoteVoteChangeMessageUpdaterService.name,
      )
      return
    }

    const generatedResponse = await this.responseGen.formatResponse(
      pendingQuote,
    )

    await message.edit(generatedResponse)

    logger.verbose(
      `Updated the displayed message for quote ${quoteId}`,
      PendingQuoteVoteChangeMessageUpdaterService.name,
    )
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(ReadModelSyncedEvent),
        filter(({ event }) => TARGET_EVENTS.has(event.eventName)),
        groupBy(({ event }) => event.aggregateId),
        mergeMap((e) => {
          return e.pipe(
            debounceTime(1000),
            map(({ event }) => event.aggregateId),
          )
        }),
      )
      .subscribe(this.refreshDisplayedMessage.bind(this))
  }
}
