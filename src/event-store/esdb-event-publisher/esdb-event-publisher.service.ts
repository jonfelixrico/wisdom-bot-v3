import { Injectable, Logger } from '@nestjs/common'
import { END, EventStoreDBClient } from '@eventstore/db-client'
import { EventBus } from '@nestjs/cqrs'
import { EsdbLiveSubscriptionEvent } from './esdb-live-subscription.event'

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

        if (!isJson) {
          logger.debug(
            `Event ${id} is not JSON, skipped.`,
            EsdbEventPublisherService.name,
          )
        } else if (type.startsWith('$')) {
          logger.debug(
            `Event ${id} is a system event (${type}), skipped.`,
            EsdbEventPublisherService.name,
          )
        } else {
          logger.debug(
            `Received event ${id} from stream ${streamId} of type ${type}.`,
          )
          this.bus.publish(new EsdbLiveSubscriptionEvent(event))
        }
      })
  }
}
