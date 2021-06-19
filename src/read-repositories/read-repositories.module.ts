import { Module } from '@nestjs/common'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { GetPendingQuoteByMessageIdQueryHandlerService } from './handlers/get-pending-quote-by-message-id-query-handler/get-pending-quote-by-message-id-query-handler.service'

@Module({
  providers: [GetPendingQuoteByMessageIdQueryHandlerService],

  imports: [EventStoreModule],
})
export class ReadRepositoriesModule {}
