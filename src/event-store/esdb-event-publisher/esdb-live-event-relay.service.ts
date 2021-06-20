import { Injectable, Logger } from '@nestjs/common'
import { END, EventStoreDBClient } from '@eventstore/db-client'
import { EventBus } from '@nestjs/cqrs'
import { EsdbLiveEvent } from './esdb-live.event'

@Injectable()
/**
 * The responsibility of this service is to listen to ESDB's "$all" stream and relay it
 * to the entire app via NestJS' CQRS event bus.
 *
 * Non-JSON events or system events are not relayed.
 */
export class EsdbLiveEventRelayService {
  constructor(
    private client: EventStoreDBClient,
    private bus: EventBus,
    private logger: Logger,
  ) {
    this.initiateSubscription()
  }

  private initiateSubscription() {
    const { logger } = this
    this.client
      .subscribeToAll({ fromPosition: END })
      .on('data', ({ event }) => {
        const { isJson, type, id, streamId } = event

        if (type.startsWith('$')) {
          logger.debug(
            `Skipped event ${id} from stream ${streamId}; Reason: system event (${type})`,
            EsdbLiveEventRelayService.name,
          )
        } else if (!isJson) {
          logger.debug(
            `Skipped event ${id} from stream ${streamId}; Reason: not JSON`,
            EsdbLiveEventRelayService.name,
          )
        } else {
          logger.debug(
            `Relayed event ${id} from stream ${streamId} of type ${type}`,
            EsdbLiveEventRelayService.name,
          )
          this.bus.publish(new EsdbLiveEvent(event))
        }
      })
  }
}
