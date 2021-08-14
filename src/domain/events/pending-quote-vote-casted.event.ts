import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IPendingQuoteVoteCastedEventPayload extends EventPayload {
  readonly quoteId: string
  readonly userId: string
  readonly voteValue: number
}

export class PendingQuoteVoteCastedEvent extends DomainEvent<IPendingQuoteVoteCastedEventPayload> {
  constructor(payload: IPendingQuoteVoteCastedEventPayload) {
    super(DomainEventNames.PENDING_QUOTE_VOTE_CASTED, payload.quoteId, payload)
  }
}
