import { DomainEvent } from 'src/domain/domain-event.abstract'

export class PendingQuoteAccepted extends DomainEvent {
  constructor(quoteId: string) {
    super('QUOTE_ACCEPTED', quoteId, {})
  }
}
