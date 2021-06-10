import { Module } from '@nestjs/common'
import { EventSourcingModule } from 'src/event-sourcing/event-sourcing.module'
import { GenericDomainEventHandlerService } from './generic-domain-event-handler/generic-domain-event-handler.service'

@Module({
  imports: [EventSourcingModule],
  providers: [GenericDomainEventHandlerService],
})
export class EventHandlersModule {}
