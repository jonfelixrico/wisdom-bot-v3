import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { dbProvider } from './db/db.provider'
import { QuoteExpirationCatchUpService } from './event-sourcing/quote-expiration-catch-up/quote-expiration-catch-up.service'
import { ExpiredQuoteWatcherService } from './services/expired-quote-watcher/expired-quote-watcher.service'

@Module({
  imports: [EventStoreModule],
  providers: [
    dbProvider,
    QuoteExpirationCatchUpService,
    ExpiredQuoteWatcherService,
  ],
})
export class QuoteExpirationModule {}
