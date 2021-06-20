import { EventStoreDBClient, JSONType } from '@eventstore/db-client'
import {
  EventBus,
  EventsHandler,
  IEventHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs'
import { EsdbLiveEvent } from 'src/event-store/esdb-event-publisher/esdb-live.event'
import { EsdbCatchUpQuery } from 'src/read-repositories/esdb-catch-up.query'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'

/**
 * This class is responsible for emitting one thing and one thing only: ReadRepositoryEsdbEvent
 * instances. Each instance represents an event (or events) belonging to a stream. It emits both
 * live and past events.
 *
 * It gets its live events from EsdbLiveEvent instances from the event bus. Past events triggered
 * to be emitted by listening to queries.
 */
@EventsHandler(EsdbLiveEvent)
@QueryHandler(EsdbCatchUpQuery)
export class ReadRepositoriesEsdbService
  implements IEventHandler<EsdbLiveEvent>, IQueryHandler<EsdbCatchUpQuery>
{
  constructor(private eventBus: EventBus, private client: EventStoreDBClient) {}

  /**
   * This is for relaying EsdbLiveEvent instances as ReadRepositoryEsdbEvents.
   * @param param0
   */
  handle({ streamId, data, revision, type }: EsdbLiveEvent<JSONType>) {
    this.eventBus.publish(
      new ReadRepositoryEsdbEvent(streamId, [{ data, revision, type }], 'LIVE'),
    )
  }

  /**
   * This is for listening to EsdbCatchUpQuery instances emitted by what we assume are read models.
   * Like what we do with EsdbLiveEvents that we catch from the event bus, we emit the resuls
   * of the queries as ReadRepositoryEsdbEvent instances.
   * @param param0
   * @returns True if events are found, false if otherwise.
   */
  async execute({
    fromRevision,
    streamName,
    maxCount,
  }: EsdbCatchUpQuery): Promise<boolean> {
    const resolvedEvents = await this.client.readStream(streamName, {
      fromRevision,
      maxCount,
    })

    if (!resolvedEvents.length) {
      return false
    }

    const eventToPublish = new ReadRepositoryEsdbEvent(
      streamName,
      resolvedEvents.map(({ event }) => {
        const { data, type, revision } = event
        return {
          data,
          type,
          revision,
        }
      }),
      'CATCH_UP',
    )

    this.eventBus.publish(eventToPublish)

    return true
  }
}
