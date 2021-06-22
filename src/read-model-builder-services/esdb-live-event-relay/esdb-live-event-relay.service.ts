import { Logger } from '@nestjs/common'
import { EventBus, EventsHandler } from '@nestjs/cqrs'
import { EsdbLiveEvent } from 'src/event-store/esdb-event-publisher/esdb-live.event'
import { LiveMessage } from '../classes/live-message.event'

@EventsHandler(EsdbLiveEvent)
export class EsdbLiveEventRelayService {
  constructor(private eventBus: EventBus, private logger: Logger) {}

  /**
   * This is for relaying EsdbLiveEvent instances as ReadRepositoryEsdbEvents.
   * @param param0
   */
  handle({ streamId, data, revision, type }: EsdbLiveEvent<any>) {
    this.eventBus.publish(new LiveMessage(streamId, revision, type, data))

    this.logger.debug(
      `Relayed live event ${type} with revision ${revision} from stream ${streamId}.`,
      EsdbLiveEventRelayService.name,
    )
  }
}
