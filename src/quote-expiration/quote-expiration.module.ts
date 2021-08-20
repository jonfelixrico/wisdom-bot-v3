import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { dbProvider } from './db/db.provider'

@Module({
  imports: [EventStoreModule],
  providers: [dbProvider],
})
export class QuoteExpirationModule {}
