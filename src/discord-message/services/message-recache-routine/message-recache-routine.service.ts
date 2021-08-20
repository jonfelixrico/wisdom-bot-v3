import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventBus, ofType } from '@nestjs/cqrs'
import { from, timer } from 'rxjs'
import { groupBy, mergeMap, take } from 'rxjs/operators'
import { QuoteMessageTypeormEntity } from 'src/discord-message/db/quote-message.typeorm-entity'
import { DiscordMessageCatchUpFinishedEvent } from 'src/discord-message/event-sourcing/discord-message-catch-up-finished.event'
import { RegeneratePendingQuoteMessageCommand } from 'src/infrastructure/commands/regenerate-pending-quote-message.command'
import { Connection } from 'typeorm'
import { ThrottledMessageFetcherService } from '../throttled-message-fetcher/throttled-message-fetcher.service'

const ROUTINE_INTERVAL = 60 * 1000 * 60 // run every hour
const PER_CHANNEL_CONCURRENCY = 1

@Injectable()
export class MessageRecacheRoutineService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private conn: Connection,
    private commandBus: CommandBus,
    private fetcher: ThrottledMessageFetcherService,
  ) {}

  private async processQuote({
    channelId,
    quoteId,
    guildId,
    messageId,
  }: QuoteMessageTypeormEntity) {
    const { message, error, inaccessible } = await this.fetcher.fetchMessage({
      channelId,
      messageId,
      guildId,
    })

    if (inaccessible) {
      // TODO add error logging
      return
    } else if (error) {
      // TODO add error logging
      return
    } else if (!message) {
      // TODO add info logging
      await this.commandBus.execute(
        new RegeneratePendingQuoteMessageCommand({ quoteId }),
      )
    }

    // TODO add verbose logging
  }

  private async runRoutine() {
    const { logger } = this
    const quotes = await this.conn
      .getRepository(QuoteMessageTypeormEntity)
      .find()

    if (!quotes.length) {
      logger.log(`No messages to recache.`, MessageRecacheRoutineService.name)
      return
    }

    logger.verbose(
      `Recaching ${quotes.length} messages`,
      MessageRecacheRoutineService.name,
    )

    await new Promise<void>((resolve) => {
      from(quotes)
        .pipe(
          groupBy(({ channelId }) => channelId),
          mergeMap((group$) => {
            return group$.pipe(
              mergeMap(this.processQuote.bind(this), PER_CHANNEL_CONCURRENCY),
            )
          }),
        )
        .subscribe({
          complete: resolve,
        })
    })

    logger.log(`Recached ${quotes} messages`, MessageRecacheRoutineService.name)
  }

  onModuleInit() {
    this.eventBus
      .pipe(
        ofType(DiscordMessageCatchUpFinishedEvent),
        take(1),
        mergeMap(() => timer(0, ROUTINE_INTERVAL)),
      )
      .subscribe(this.runRoutine.bind(this))
  }
}
