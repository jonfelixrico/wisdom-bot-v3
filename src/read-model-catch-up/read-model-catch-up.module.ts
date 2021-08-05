import { Module } from '@nestjs/common'
import { TypeormModule } from 'src/typeorm/typeorm.module'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { CqrsModule } from '@nestjs/cqrs'
import { EventSyncNotifierService } from './services/event-sync-notifier/event-sync-notifier.service'
import { CatchUpService } from './services/catch-up/catch-up.service'

@Module({
  providers: [EventSyncNotifierService, CatchUpService],
  imports: [TypeormModule, EventStoreModule, CqrsModule],
})
export class ReadModelCatchUpModule {}
