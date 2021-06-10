import { Module } from '@nestjs/common'
import { GenericDomainEventHandlerService } from './generic-domain-event-handler/generic-domain-event-handler.service'

@Module({
  providers: [GenericDomainEventHandlerService],
})
export class EventHandlersModule {}
