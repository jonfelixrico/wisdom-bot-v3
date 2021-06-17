import { DomainEvent } from 'src/domain/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export class PendingQuoteCancelled extends DomainEvent {
  constructor(quoteId: string) {
    super(DomainEventNames.PENDING_QUOTE_CANCELLED, quoteId, {})
  }
}
