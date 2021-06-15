import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventSourcingModule } from 'src/event-sourcing/event-sourcing.module'
import { GenericDomainEventHandlerService } from './generic-domain-event-handler/generic-domain-event-handler.service'

@Module({
  imports: [CqrsModule, EventSourcingModule],
  providers: [GenericDomainEventHandlerService],
})
export class EventHandlersModule {}
