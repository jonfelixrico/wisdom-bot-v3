import { DomainEvent } from 'src/domain/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export interface IPendingQuoteAcceptedPayload {
  quoteId: string
  acceptDt: Date
}

export class PendingQuoteAccepted extends DomainEvent<IPendingQuoteAcceptedPayload> {
  constructor(payload: IPendingQuoteAcceptedPayload) {
    super(DomainEventNames.PENDING_QUOTE_ACCEPTED, payload.quoteId, payload)
  }
}
