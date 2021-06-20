import { Injectable, Logger } from '@nestjs/common'
import { EsdbLiveEvent } from 'src/event-store/esdb-event-publisher/esdb-live.event'
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { JSONType } from '@eventstore/db-client'

@Injectable()
@EventsHandler(EsdbLiveEvent)
export class ReadRepositoriesEsdbLiveEventRelayService
  implements IEventHandler<EsdbLiveEvent>
{
  constructor(private eventBus: EventBus, private logger: Logger) {}

  /**
   * This is for relaying EsdbLiveEvent instances as ReadRepositoryEsdbEvents.
   * @param param0
   */
  handle({ streamId, data, revision, type }: EsdbLiveEvent<JSONType>) {
    this.eventBus.publish(
      new ReadRepositoryEsdbEvent(streamId, [{ data, revision, type }], 'LIVE'),
    )

    this.logger.debug(
      `Relayed live event ${type} with revision ${revision} from stream ${streamId}.`,
      ReadRepositoriesEsdbLiveEventRelayService.name,
    )
  }
}
