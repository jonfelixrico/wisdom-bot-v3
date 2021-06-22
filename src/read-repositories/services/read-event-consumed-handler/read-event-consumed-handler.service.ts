import { Logger, OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { ReadEventConsumedEvent } from 'src/read-repositories/read-event-consumed.event'
import { EventStoreDBClient } from '@eventstore/db-client'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { filter, mergeMap } from 'rxjs/operators'
import { from } from 'rxjs'

const CONCURRENCY_LIMIT = 50

@Injectable()
export class ReadEventConsumedHandlerService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private logger: Logger,
    private client: EventStoreDBClient,
  ) {}

  private async retrieveFromStream({
    fromRevision,
    streamName,
  }: ReadEventConsumedEvent): Promise<void> {
    const [resolvedEvent] = await this.client.readStream(streamName, {
      fromRevision: fromRevision,
      maxCount: 1,
    })

    if (!resolvedEvent) {
      this.logger.debug(
        `No events found in ${streamName} after revision ${fromRevision}.`,
        ReadEventConsumedHandlerService.name,
      )
      return null
    }

    const { revision, type, data } = resolvedEvent.event
    const event = new ReadRepositoryEsdbEvent(streamName, revision, type, data)
    this.eventBus.publish(event)
    this.logger.debug(
      `Emitted event #${revision} from stream ${streamName}.`,
      ReadEventConsumedHandlerService.name,
    )
  }

  onModuleInit() {
    this.eventBus.subject$
      .pipe(
        filter<ReadEventConsumedEvent>(
          (event) => event instanceof ReadEventConsumedEvent,
        ),
        mergeMap(
          (event) => from(this.retrieveFromStream(event)),
          CONCURRENCY_LIMIT,
        ),
      )
      .subscribe()
  }
}
