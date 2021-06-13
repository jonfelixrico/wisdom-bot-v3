import { DomainEvent } from 'src/domain/domain-event.abstract'

interface IReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceived extends DomainEvent<IReceive> {
  constructor(receive: IReceive) {
    super('QUOTE_RECEIVED', receive.quoteId, receive)
  }
}
