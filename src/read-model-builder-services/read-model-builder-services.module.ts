import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { GetEventQueryHandlerService } from './get-event-query-handler/get-event-query-handler.service'

@Module({
  imports: [EventStoreModule, CqrsModule],
  providers: [GetEventQueryHandlerService],
})
export class ReadModelBuilderServicesModule {}
