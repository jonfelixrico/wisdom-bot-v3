import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IQuoteReceivedPayload extends EventPayload {
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceivedEvent extends DomainEvent<IQuoteReceivedPayload> {
  constructor(receive: IQuoteReceivedPayload) {
    super(DomainEventNames.QUOTE_RECEIVED, receive.quoteId, receive)
  }
}
