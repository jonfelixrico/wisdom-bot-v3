import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'
import { StreamReaderService } from './stream-reader/stream-reader.service'

const exportedProviders = [eventStoreClientProvider, StreamReaderService]

@Module({
  exports: exportedProviders,
  providers: [...exportedProviders],
})
export class EventStoreModule {}
