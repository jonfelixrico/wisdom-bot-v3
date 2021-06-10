import { Module } from '@nestjs/common'
import { eventStoreProvider } from './event-store-client.provider'

@Module({
  providers: [eventStoreProvider],
  exports: [eventStoreProvider],
})
export class EventSourcingModule {}
