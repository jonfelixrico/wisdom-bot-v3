import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteCancelledPayload extends EventPayload {
  quoteId: string
  cancelDt: Date
}

export class PendingQuoteCancelledEvent extends DomainEvent<IPendingQuoteCancelledPayload> {
  constructor(payload: IPendingQuoteCancelledPayload) {
    super(DomainEventNames.PENDING_QUOTE_CANCELLED, payload.quoteId, payload)
  }
}
