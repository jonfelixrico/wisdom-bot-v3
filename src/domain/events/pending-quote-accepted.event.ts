import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteAcceptedPayload extends EventPayload {
  quoteId: string
  acceptDt: Date
}

export class PendingQuoteAcceptedEvent extends DomainEvent<IPendingQuoteAcceptedPayload> {
  constructor(payload: IPendingQuoteAcceptedPayload) {
    super(DomainEventNames.PENDING_QUOTE_ACCEPTED, payload.quoteId, payload)
  }
}
