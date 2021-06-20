import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { GetPendingQuoteByMessageIdQueryHandlerService } from './handlers/get-pending-quote-by-message-id-query-handler/get-pending-quote-by-message-id-query-handler.service'
import { ReadRepositoriesEsdbService } from './services/read-repositories-esdb/read-repositories-esdb.service'

@Module({
  imports: [EventStoreModule, TypeormModule, CqrsModule],
  providers: [
    GetPendingQuoteByMessageIdQueryHandlerService,
    ReadRepositoriesEsdbService,
  ],
})
export class ReadRepositoriesModule {}
