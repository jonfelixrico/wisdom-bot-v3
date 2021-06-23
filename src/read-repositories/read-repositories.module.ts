import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { QuoteSubmittedReducerService } from './reducers/quote-submitted-reducer/quote-submitted-reducer.service'
import { QuoteAcceptedReducerService } from './reducers/quote-accepted-reducer/quote-accepted-reducer.service'
import { QuoteCancelledReducerService } from './reducers/quote-cancelled-reducer/quote-cancelled-reducer.service'
import { QuoteRevisionTriggerService } from './revision-triggers/quote-revision-trigger/quote-revision-trigger.service'

@Module({
  imports: [CqrsModule, EventStoreModule, TypeormModule],
  providers: [
    QuoteSubmittedReducerService,
    QuoteAcceptedReducerService,
    QuoteCancelledReducerService,
    QuoteRevisionTriggerService,
  ],
})
export class ReadRepositoriesModule {}
