export class PendingQuoteAccepted {
  readonly quoteId: string

  constructor(quoteId: string) {
    this.quoteId = quoteId
  }
}
