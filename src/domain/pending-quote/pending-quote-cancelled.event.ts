import { DomainEvent } from 'src/domain/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export interface IPendingQuoteCancelledPayload {
  quoteId: string
  cancelDt: Date
}

export class PendingQuoteCancelled extends DomainEvent<IPendingQuoteCancelledPayload> {
  constructor(payload: IPendingQuoteCancelledPayload) {
    super(DomainEventNames.PENDING_QUOTE_CANCELLED, payload.quoteId, payload)
  }
}
