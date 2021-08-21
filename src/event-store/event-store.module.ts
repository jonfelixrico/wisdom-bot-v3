import { Module } from '@nestjs/common'
import { eventStoreClientProvider } from './event-store-client.provider'

@Module({
  exports: [eventStoreClientProvider],
  providers: [eventStoreClientProvider],
})
export class EventStoreModule {}
