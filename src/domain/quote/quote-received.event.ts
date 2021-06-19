import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

interface IReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceived extends DomainEvent<IReceive> {
  constructor(receive: IReceive) {
    super(DomainEventNames.QUOTE_RECEIVED, receive.quoteId, receive)
  }
}
