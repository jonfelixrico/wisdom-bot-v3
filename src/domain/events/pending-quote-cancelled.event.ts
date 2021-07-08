import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { BasePendingQuoteEvent } from './base-pending-quote-event.abstract'

export interface IPendingQuoteCancelledPayload {
  quoteId: string
  cancelDt: Date
}

export class PendingQuoteCancelledEvent extends BasePendingQuoteEvent<IPendingQuoteCancelledPayload> {
  constructor(payload: IPendingQuoteCancelledPayload) {
    super(DomainEventNames.PENDING_QUOTE_CANCELLED, payload.quoteId, payload)
  }
}
