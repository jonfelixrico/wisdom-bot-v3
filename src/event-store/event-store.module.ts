import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'

@Module({
  providers: [eventStoreClientProvider],
  exports: [eventStoreClientProvider],
})
export class EventStoreModule {}
