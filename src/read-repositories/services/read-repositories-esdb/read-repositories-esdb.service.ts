import { JSONType } from '@eventstore/db-client'
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { EsdbLiveEvent } from 'src/event-store/esdb-event-publisher/esdb-live.event'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'

@EventsHandler()
export class ReadRepositoriesEsdbService
  implements IEventHandler<EsdbLiveEvent>
{
  constructor(private eventBus: EventBus) {}

  handle({ streamId, data, revision, type }: EsdbLiveEvent<JSONType>) {
    this.eventBus.publish(
      new ReadRepositoryEsdbEvent(streamId, [{ data, revision, type }]),
    )
  }
}
