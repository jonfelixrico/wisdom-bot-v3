import { Logger, OnModuleInit } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { from } from 'rxjs'
import { catchError, filter, mergeMap } from 'rxjs/operators'

export abstract class BaseConcurrencyLimitedEventHandler
  implements OnModuleInit
{
  abstract readonly CONCURRENCY_LIMIT: number
  abstract readonly CLASS_NAME: string

  constructor(protected eventBus: EventBus, protected logger: Logger) {}

  abstract handle(e: any): Promise<void>

  abstract filter(e: any): boolean

  onModuleInit() {
    const filterFn = this.filter.bind(this)
    const handleFn = this.handle.bind(this)
    const { logger } = this

    logger.verbose('Started listening for events.', this.CLASS_NAME)
    this.eventBus
      .pipe(
        filter(filterFn),
        mergeMap((event) => {
          return from(handleFn(event)).pipe(
            catchError((error: Error) => {
              logger.error(
                `Uncaught error: ${error.message}`,
                error.stack,
                this.CLASS_NAME,
              )
              return null
            }),
          )
        }, this.CONCURRENCY_LIMIT),
      )
      .subscribe()
  }
}
