import { Logger, OnModuleInit } from '@nestjs/common'
import {
  ErrorType,
  EventStoreDBClient,
  ResolvedEvent,
} from '@eventstore/db-client'
import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetEventQuery } from '../classes/get-event.query'
import { of, Subject, throwError } from 'rxjs'
import { v4 } from 'uuid'
import { filter, mergeMap, take } from 'rxjs/operators'
import { QueriedMessage } from '../classes/live-message.event'

interface IQueuedQuery {
  query: GetEventQuery
  jobId: string
}

type IQueryOutput = {
  jobId: string
  error?: Error
  result?: any
}

const MAX_CONCURRENT_QUERIES = 50

@QueryHandler(GetEventQuery)
export class GetEventQueryHandlerService
  implements OnModuleInit, IQueryHandler<GetEventQuery>
{
  private queue$ = new Subject<IQueuedQuery>()
  private output$ = new Subject<IQueryOutput>()

  constructor(
    private client: EventStoreDBClient,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  private generateQueryPromise(jobId: string): Promise<any> {
    return this.output$
      .pipe(
        filter((output) => output.jobId === jobId),
        take(1),
        mergeMap(({ result, error }) =>
          error ? throwError(error) : of(result),
        ),
      )
      .toPromise()
  }

  execute(query: GetEventQuery): Promise<any> {
    const jobId = v4()
    try {
      return this.generateQueryPromise(jobId)
    } finally {
      this.queue$.next({
        jobId,
        query,
      })
    }
  }

  private publishEvent({ event }: ResolvedEvent) {
    const { revision, type, data, streamId } = event
    const toPublish = new QueriedMessage(streamId, revision, type, data)
    this.eventBus.publish(toPublish)
  }

  private async processQuery({ query, jobId }: IQueuedQuery): Promise<void> {
    const { revision: fromRevision, streamId } = query
    const { output$: results$ } = this

    try {
      const [resolvedEvent] = await this.client.readStream(streamId, {
        fromRevision,
        maxCount: 1,
      })

      if (!resolvedEvent) {
        this.logger.debug(
          `Revision ${fromRevision} not found from stream ${streamId}.`,
          GetEventQueryHandlerService.name,
        )

        return results$.next({
          jobId,
          result: null,
        })
      }

      this.publishEvent(resolvedEvent)
    } catch (error) {
      if (error.type === ErrorType.STREAM_NOT_FOUND) {
        this.logger.warn(
          `Stream ${streamId} not found.`,
          GetEventQueryHandlerService.name,
        )

        return results$.next({
          jobId,
          result: null,
        })
      } else {
        results$.next({
          jobId,
          error,
        })
      }
    }
  }

  onModuleInit() {
    this.queue$
      .pipe(mergeMap(this.processQuery.bind(this), MAX_CONCURRENT_QUERIES))
      .subscribe()
  }
}
