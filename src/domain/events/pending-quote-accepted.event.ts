import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { BasePendingQuoteEvent } from './base-pending-quote-event.abstract'

export interface IPendingQuoteAcceptedPayload {
  quoteId: string
  acceptDt: Date
}

export class PendingQuoteAcceptedEvent extends BasePendingQuoteEvent<IPendingQuoteAcceptedPayload> {
  constructor(payload: IPendingQuoteAcceptedPayload) {
    super(DomainEventNames.PENDING_QUOTE_ACCEPTED, payload.quoteId, payload)
  }
}
