import { Logger } from '@nestjs/common'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { CommandBus, EventBus, ofType } from '@nestjs/cqrs'
import { timer } from 'rxjs'
import { map, mergeMap, take } from 'rxjs/operators'
import { AcknowledgePendingQuoteExpirationCommand } from 'src/domain/commands/acknowledge-pending-quote-expiration.command'
import { PerishableQuoteTypeormEntity } from 'src/quote-expiration/db/perishable-quote.typeorm-entity'
import { QuoteExpirationCatchUpFinishedEvent } from 'src/quote-expiration/quote-expiration-catch-up-finished.event'
import { Connection, LessThan } from 'typeorm'

const CHECKING_INTERVAL = 30 * 1000 // check for expired quotes every 30 seconds

/**
 * Periodically checks expired quotes. Interval can be set via the CHECKING_INTERVAL constant.
 */
@Injectable()
export class ExpiredQuoteCheckingRoutineService implements OnModuleInit {
  private inTransit = new Set<string>()

  constructor(
    private eventBus: EventBus,
    private conn: Connection,
    private commandBus: CommandBus,
    private logger: Logger,
  ) {}

  /**
   * Attempts to find expired quotes relative to `date` and asynchronously flags
   * each found quote as flagged via the expired ack command.
   *
   * @param date The date to compare each record's expireDt against.
   */
  private async checkForExpiredQuotes(date: Date) {
    const { conn, logger, inTransit } = this

    try {
      const expired = await conn
        .getRepository(PerishableQuoteTypeormEntity)
        .find({
          where: {
            expireDt: LessThan(date),
          },
        })

      const filtered = expired.filter(({ quoteId }) => !inTransit.has(quoteId))
      const expireCount = filtered.length

      if (!expireCount) {
        return
      }

      logger.debug(
        `Found ${expireCount} expired quotes.`,
        ExpiredQuoteCheckingRoutineService.name,
      )

      filtered.forEach(({ quoteId }) => {
        // intentionally did not use `await` because we want this to run asynchronously
        this.flagAsExpired(quoteId)
      })
    } catch (e) {
      logger.error(
        `An error occurred while trying to find expired quotes: ${e.message}.`,
        e.stack,
        ExpiredQuoteCheckingRoutineService.name,
      )
      return
    }
  }

  /**
   * Tells the system to flag a certain quote as expired.
   * @param quoteId The quote to flag as expired.
   */
  private async flagAsExpired(quoteId: string) {
    const { inTransit, logger } = this

    try {
      /*
       * By adding it in `inTransit`, succeeding expiration checks will be ignoring the given `quoteId`.
       * This guarantees that only 1 `flagAsExpired` call will happen per `quoteId`
       */
      inTransit.add(quoteId)
      await this.commandBus.execute(
        new AcknowledgePendingQuoteExpirationCommand({
          quoteId,
        }),
      )
      logger.log(
        `Flagged quote ${quoteId} as expired.`,
        ExpiredQuoteCheckingRoutineService.name,
      )
    } catch (e) {
      logger.error(
        `Failed to flag quote ${quoteId} as expired: ${e.message}.`,
        e.stack,
        ExpiredQuoteCheckingRoutineService.name,
      )

      // intentionally suppressed error
    } finally {
      // remove from `inTransit` to free up space in the set
      inTransit.delete(quoteId)
    }
  }

  onModuleInit() {
    /*
     * Waits until the DB has caught up with the event source before starting the timer
     * which handles interval ticks. Each tick will trigger checking for expired quotes.
     */
    this.eventBus
      .pipe(
        ofType(QuoteExpirationCatchUpFinishedEvent),
        take(1),
        mergeMap(() => {
          return timer(0, CHECKING_INTERVAL).pipe(map(() => new Date()))
        }),
      )
      .subscribe(this.checkForExpiredQuotes.bind(this))
  }
}
