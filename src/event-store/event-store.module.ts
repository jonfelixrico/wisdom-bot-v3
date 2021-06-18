import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'
import { ReadStreamService } from './read-stream/read-stream.service'

const providers = [eventStoreClientProvider, ReadStreamService]

@Module({
  providers,
  exports: providers,
})
export class EventStoreModule {}
