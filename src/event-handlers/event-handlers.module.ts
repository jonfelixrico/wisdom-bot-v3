import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from 'src/event-store/event-store.module'
import { GenericDomainEventHandlerService } from './generic-domain-event-handler/generic-domain-event-handler.service'

@Module({
  imports: [CqrsModule, EventStoreModule],
  providers: [GenericDomainEventHandlerService],
})
export class EventHandlersModule {}
