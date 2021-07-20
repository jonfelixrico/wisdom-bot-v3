import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteExpirationAcknowledgedEvent extends EventPayload {
  readonly quoteId: string
  readonly expireAckDate: Date
}

export class PendingQuoteExpirationAcknowledgedEvent extends DomainEvent<IPendingQuoteExpirationAcknowledgedEvent> {
  constructor(payload: IPendingQuoteExpirationAcknowledgedEvent) {
    super(DomainEventNames.QUOTE_RECEIVED, payload.quoteId, payload)
  }
}
