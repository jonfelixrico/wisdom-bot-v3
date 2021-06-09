interface IReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receiveId: string
  readonly quoteId: string
}

export class QuoteReceived {
  constructor(readonly receive: IReceive) {}
}
