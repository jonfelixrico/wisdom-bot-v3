import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'
import { EsdbLiveEventRelayService } from './esdb-event-publisher/esdb-live-event-relay.service'
import { CqrsModule } from '@nestjs/cqrs'

const exportedProviders = [eventStoreClientProvider]

@Module({
  exports: [...exportedProviders],
  providers: [
    ...exportedProviders,
    /*
     * We're not going to export the live stream service because it doesn't have
     * any exposed methods. It's meant to only publish events.
     */
    EsdbLiveEventRelayService,
  ],
  imports: [CqrsModule],
})
export class EventStoreModule {}
