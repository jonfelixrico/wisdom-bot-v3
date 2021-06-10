import { IEvent } from 'src/domain/event.interface'

interface IReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceived implements IEvent<IReceive> {
  constructor(private receive: IReceive) {}

  readonly eventName = 'QUOTE_RECEIVED'

  get aggregateId() {
    return this.receive.quoteId
  }

  get payload() {
    return this.receive
  }
}
