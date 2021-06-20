import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { GetPendingQuoteByMessageIdQueryHandlerService } from './handlers/get-pending-quote-by-message-id-query-handler/get-pending-quote-by-message-id-query-handler.service'
import { ReadRepositoriesEsdbLiveEventRelayService } from './services/read-repositories-esdb-live-event-relay/read-repositories-esdb-live-event-relay.service'
import { ReadRepositoriesEsdbCatchUpQueryHandlerService } from './services/read-repositories-esdb-catch-up-query-handler/read-repositories-esdb-catch-up-query-handler.service'

@Module({
  imports: [EventStoreModule, TypeormModule, CqrsModule],
  providers: [
    GetPendingQuoteByMessageIdQueryHandlerService,
    ReadRepositoriesEsdbLiveEventRelayService,
    ReadRepositoriesEsdbCatchUpQueryHandlerService,
  ],
})
export class ReadRepositoriesModule {}
