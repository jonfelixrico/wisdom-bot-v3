import { Module } from '@nestjs/common'
import { QuoteCatchUpService } from './catch-up/quote-catch-up/quote-catch-up.service'
import { CatchUpOrchestratorService } from './catch-up/catch-up-orchestrator/catch-up-orchestrator.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { ReceiveCatchUpService } from './catch-up/receive-catch-up/receive-catch-up.service'
import { EventRelayService } from './services/event-relay/event-relay.service'
import { EventListenerService } from './services/event-listener/event-listener.service'
import { QuoteQueryService } from './queries/quote-query/quote-query.service'
import { ReceiveQueryService } from './queries/receive-query/receive-query.service'
import { PendingQuoteQueryService } from './queries/pending-quote-query/pending-quote-query.service'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  providers: [
    QuoteCatchUpService,
    CatchUpOrchestratorService,
    ReceiveCatchUpService,
    EventRelayService,
    EventListenerService,
    QuoteQueryService,
    ReceiveQueryService,
    PendingQuoteQueryService,
  ],
  imports: [TypeormModule, EventStoreModule, CqrsModule],
  exports: [QuoteQueryService, ReceiveQueryService, PendingQuoteQueryService],
})
export class ReadRepositoriesModule {}
