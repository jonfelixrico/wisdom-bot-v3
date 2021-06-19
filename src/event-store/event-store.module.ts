import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'
import { ReadStreamService } from './read-stream/read-stream.service'
import { EsdbEventPublisherService } from './esdb-event-publisher/esdb-event-publisher.service'
import { CqrsModule } from '@nestjs/cqrs'

const exportedProviders = [eventStoreClientProvider, ReadStreamService]

@Module({
  exports: [...exportedProviders],
  providers: [...exportedProviders, EsdbEventPublisherService],
  imports: [CqrsModule],
})
export class EventStoreModule {}
