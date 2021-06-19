import { Injectable } from '@nestjs/common'
import { END, EventStoreDBClient } from '@eventstore/db-client'
import { EventBus } from '@nestjs/cqrs'
import { EsdbLiveSubscriptionEvent } from './esdb-live-subscription.event'

@Injectable()
export class EsdbEventPublisherService {
  constructor(private client: EventStoreDBClient, private bus: EventBus) {
    this.onInit()
  }

  onInit() {
    this.client
      .subscribeToAll({ fromPosition: END })
      .on('data', ({ event }) => {
        const { isJson } = event

        if (!isJson) {
          return
        }

        this.bus.publish(new EsdbLiveSubscriptionEvent(event))
      })
  }
}
