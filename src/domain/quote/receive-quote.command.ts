interface IReceiveInfo {
  readonly quoteId: string
  readonly messageId: string
  readonly channelId: string
  readonly userId: string
}

export class ReceiveQuote {
  constructor(readonly receive: IReceiveInfo) {}
}
