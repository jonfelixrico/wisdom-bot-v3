import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteVoteWithdrawnEventPayload extends EventPayload {
  readonly quoteId: string
  readonly userId: string
  readonly withdrawDt: Date
}

export class PendingQuoteVoteWithdrawnEvent extends DomainEvent<IPendingQuoteVoteWithdrawnEventPayload> {
  constructor(payload: IPendingQuoteVoteWithdrawnEventPayload) {
    super(
      DomainEventNames.PENDING_QUOTE_VOTE_WITHDRAWN,
      payload.quoteId,
      payload,
    )
  }
}
