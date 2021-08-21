import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { dbProvider } from './db/db.provider'
import { QuoteExpirationCatchUpService } from './event-sourcing/quote-expiration-catch-up/quote-expiration-catch-up.service'
import { ExpiredQuoteCheckingRoutineService } from './services/expired-quote-watcher/expired-quote-checking-routine.service'

@Module({
  imports: [EventStoreModule],
  providers: [
    dbProvider,
    QuoteExpirationCatchUpService,
    ExpiredQuoteCheckingRoutineService,
  ],
})
export class QuoteExpirationModule {}
