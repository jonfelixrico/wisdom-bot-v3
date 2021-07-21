import { Module } from '@nestjs/common'
import { QuoteCatchUpService } from './catch-up/quote-catch-up/quote-catch-up.service'
import { CatchUpOrchestratorService } from './catch-up/catch-up-orchestrator/catch-up-orchestrator.service'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { ReceiveCatchUpService } from './catch-up/receive-catch-up/receive-catch-up.service'
import { EventRelayService } from './services/event-relay/event-relay.service'
import { EventListenerService } from './services/event-listener/event-listener.service'
import { CqrsModule } from '@nestjs/cqrs'
import { EventSyncNotifierService } from './services/event-sync-notifier/event-sync-notifier.service'

@Module({
  providers: [
    QuoteCatchUpService,
    CatchUpOrchestratorService,
    ReceiveCatchUpService,
    EventRelayService,
    EventListenerService,
    EventSyncNotifierService,
  ],
  imports: [TypeormModule, EventStoreModule, CqrsModule],
})
export class ReadModelCatchUpModule {}
