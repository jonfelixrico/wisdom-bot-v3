import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { GetEventQueryHandlerService } from './get-event-query-handler/get-event-query-handler.service'
import { EsdbLiveEventRelayService } from './esdb-live-event-relay/esdb-live-event-relay.service'
import { StreamsProjectionService } from './streams-projection/streams-projection.service'

@Module({
  imports: [EventStoreModule, CqrsModule],
  providers: [
    GetEventQueryHandlerService,
    EsdbLiveEventRelayService,
    StreamsProjectionService,
  ],
  exports: [
    GetEventQueryHandlerService,
    EsdbLiveEventRelayService,
    StreamsProjectionService,
  ],
})
export class ReadModelBuilderServicesModule {}
