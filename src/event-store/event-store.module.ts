import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'
import { CqrsModule } from '@nestjs/cqrs'
import { StreamReaderService } from './stream-reader/stream-reader.service'

const exportedProviders = [eventStoreClientProvider, StreamReaderService]

@Module({
  exports: exportedProviders,
  providers: [...exportedProviders],
  imports: [CqrsModule],
})
export class EventStoreModule {}
