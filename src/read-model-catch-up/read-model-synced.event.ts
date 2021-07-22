import { IEvent } from '@nestjs/cqrs'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

/**
 * This event lets us know that the read model has finished syncing with a DomainEvent that
 * was published by the write repositories of this app instance.
 */
export class ReadModelSyncedEvent implements IEvent {
  constructor(readonly event: DomainEvent) {}
}
