import { Event } from 'src/domain/event.abstract'

interface IReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceived extends Event<IReceive> {
  constructor(receive: IReceive) {
    super('QUOTE_RECEIVED', receive.quoteId, receive)
  }
}
