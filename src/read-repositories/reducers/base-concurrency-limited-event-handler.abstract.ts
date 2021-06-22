import { Logger, OnModuleInit } from '@nestjs/common'
import { EventBus, QueryBus } from '@nestjs/cqrs'
import { from } from 'rxjs'
import { catchError, filter, mergeMap } from 'rxjs/operators'
import { ReadEventConsumedEvent } from '../read-event-consumed.event'
import { ReadRepositoryEsdbEvent } from '../read-repository-esdb.event'

export enum ReduceStatus {
  CONSUMED,
  SKIPPED,
}

export abstract class BaseConcurrencyLimitedEventHandler<PayloadType>
  implements OnModuleInit
{
  abstract readonly CONCURRENCY_LIMIT: number
  abstract readonly CLASS_NAME: string

  constructor(
    protected eventBus: EventBus,
    protected queryBus: QueryBus,
    protected logger: Logger,
  ) {}

  abstract handle(
    e: ReadRepositoryEsdbEvent<PayloadType>,
  ): Promise<ReduceStatus>

  abstract filter(e: ReadRepositoryEsdbEvent<PayloadType>): boolean

  private async doHandling(
    e: ReadRepositoryEsdbEvent<PayloadType>,
  ): Promise<void> {
    const { isLive, streamId, revision, type } = e
    const status = await this.handle(e)
    const { CLASS_NAME } = this

    if (status === ReduceStatus.CONSUMED) {
      if (isLive) {
        await this.queryBus.execute(
          new ReadEventConsumedEvent(streamId, revision),
        )
      }

      this.logger.debug(
        `Consumed revision ${revision} from stream ${streamId} with event type ${type}`,
        CLASS_NAME,
      )
    } else {
      this.logger.debug(
        `Skipped revision ${revision} from stream ${streamId} with event type ${type}`,
        CLASS_NAME,
      )
    }
  }

  onModuleInit() {
    const filterFn = this.filter.bind(this)
    const doHandling = this.doHandling.bind(this)
    const { logger, CLASS_NAME, CONCURRENCY_LIMIT } = this

    logger.verbose('Started listening for events.', CLASS_NAME)
    this.eventBus
      .pipe(
        filter((e) => e instanceof ReadRepositoryEsdbEvent),
        filter(filterFn),
        mergeMap((event) => {
          return from(doHandling(event)).pipe(
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
