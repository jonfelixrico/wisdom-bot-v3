import { Injectable, Logger } from '@nestjs/common'
import { END, EventStoreDBClient } from '@eventstore/db-client'
import { EventBus } from '@nestjs/cqrs'
import { EsdbLiveEvent } from './esdb-live.event'

@Injectable()
export class EsdbEventPublisherService {
  constructor(
    private client: EventStoreDBClient,
    private bus: EventBus,
    private logger: Logger,
  ) {
    this.onInit()
  }

  onInit() {
    const { logger } = this
    this.client
      .subscribeToAll({ fromPosition: END })
      .on('data', ({ event }) => {
        const { isJson, type, id, streamId } = event

        if (type.startsWith('$')) {
          logger.debug(
            `Skipped event ${id} from stream ${streamId}; Reason: system event (${type})`,
            EsdbEventPublisherService.name,
          )
        } else if (!isJson) {
          logger.debug(
            `Skipped event ${id} from stream ${streamId}; Reason: not JSON`,
            EsdbEventPublisherService.name,
          )
        } else {
          logger.debug(
            `Relayed event ${id} from stream ${streamId} of type ${type}`,
            EsdbEventPublisherService.name,
          )
          this.bus.publish(new EsdbLiveEvent(event))
        }
      })
  }
}
