import { DomainEvent } from 'src/domain/domain-event.abstract'

export class PendingQuoteCancelled extends DomainEvent {
  constructor(quoteId: string) {
    super('QUOTE_CANCELLED', quoteId, {})
  }
}
