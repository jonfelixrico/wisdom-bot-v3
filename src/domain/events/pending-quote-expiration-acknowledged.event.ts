import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteExpirationAcknowledgedEventPayload
  extends EventPayload {
  readonly quoteId: string
  readonly expireAckDt: Date
}

export class PendingQuoteExpirationAcknowledgedEvent extends DomainEvent<IPendingQuoteExpirationAcknowledgedEventPayload> {
  constructor(payload: IPendingQuoteExpirationAcknowledgedEventPayload) {
    super(
      DomainEventNames.PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
      payload.quoteId,
      payload,
    )
  }
}
