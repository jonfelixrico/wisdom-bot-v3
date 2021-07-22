import { IEvent } from '@nestjs/cqrs'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

export class DomainEventPublishedEvent implements IEvent {
  constructor(readonly event: DomainEvent, readonly revision: bigint) {}
}
