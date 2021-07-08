import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export interface IQuoteReceivedPayload {
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceivedEvent extends DomainEvent<IQuoteReceivedPayload> {
  constructor(receive: IQuoteReceivedPayload) {
    super(DomainEventNames.QUOTE_RECEIVED, receive.quoteId, receive)
  }
}
