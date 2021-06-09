export class PendingQuoteCancelled {
  readonly quoteId: string

  constructor(quoteId: string) {
    this.quoteId = quoteId
  }
}
