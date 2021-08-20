import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventBus, ofType } from '@nestjs/cqrs'
import { from, timer } from 'rxjs'
import { groupBy, mergeMap, take } from 'rxjs/operators'
import { QuoteMessageTypeormEntity } from 'src/discord-message/db/quote-message.typeorm-entity'
import { DiscordMessageCatchUpFinishedEvent } from 'src/discord-message/event-sourcing/discord-message-catch-up-finished.event'
import { Connection } from 'typeorm'

const ROUTINE_INTERVAL = 60 * 1000 * 60 // run every hour
const CONCURRENCY_LIMIT = 10
const PER_CHANNEL_CONCURRENCY = 1

@Injectable()
export class MessageRecacheRoutineService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private conn: Connection,
    private commandBus: CommandBus,
  ) {}

  private async processQuote(quote: QuoteMessageTypeormEntity) {
    // NOOP
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
