import { Logger, OnModuleInit } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { from } from 'rxjs'
import { catchError, filter, mergeMap } from 'rxjs/operators'
import { ReadRepositoryEsdbEvent } from '../read-repository-esdb.event'

export abstract class BaseConcurrencyLimitedEventHandler<PayloadType>
  implements OnModuleInit
{
  abstract readonly CONCURRENCY_LIMIT: number
  abstract readonly CLASS_NAME: string

  constructor(protected eventBus: EventBus, protected logger: Logger) {}

  abstract handle(e: ReadRepositoryEsdbEvent<PayloadType>): Promise<void>

  abstract filter(e: ReadRepositoryEsdbEvent<PayloadType>): boolean

  onModuleInit() {
    const filterFn = this.filter.bind(this)
    const handleFn = this.handle.bind(this)
    const { logger, CLASS_NAME, CONCURRENCY_LIMIT } = this

    logger.verbose('Started listening for events.', CLASS_NAME)
    this.eventBus
      .pipe(
        filter((e) => e instanceof ReadRepositoryEsdbEvent),
        filter(filterFn),
        mergeMap((event) => {
          return from(handleFn(event)).pipe(
            catchError((error: Error) => {
              logger.error(
                `Uncaught error: ${error.message}`,
                error.stack,
                CLASS_NAME,
              )
              return null
            }),
          )
        }, CONCURRENCY_LIMIT),
      )
      .subscribe()
  }
}
