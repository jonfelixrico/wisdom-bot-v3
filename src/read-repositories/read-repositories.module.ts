import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { ReadRepositoriesEsdbLiveEventRelayService } from './services/read-repositories-esdb-live-event-relay/read-repositories-esdb-live-event-relay.service'
import { ReadRepositoriesEsdbStartupService } from './services/read-repositories-esdb-startup/read-repositories-esdb-startup.service'
import { QuoteSubmittedReducerService } from './reducers/quote-submitted-reducer/quote-submitted-reducer.service'
import { ReadEventConsumedHandlerService } from './services/read-event-consumed-handler/read-event-consumed-handler.service'
import { QuoteAcceptedReducerService } from './reducers/quote-accepted-reducer/quote-accepted-reducer.service'
import { QuoteCancelledReducerService } from './reducers/quote-cancelled-reducer/quote-cancelled-reducer.service'

@Module({
  imports: [CqrsModule, EventStoreModule, TypeormModule],
  providers: [
    ReadRepositoriesEsdbLiveEventRelayService,
    ReadRepositoriesEsdbStartupService,
    QuoteSubmittedReducerService,
    ReadEventConsumedHandlerService,
    QuoteAcceptedReducerService,
    QuoteCancelledReducerService,
  ],
})
export class ReadRepositoriesModule {}
