import { IEvent } from 'src/domain/event.interface'
import { IPendingQuote } from './pending-quote.interface'

export class QuoteSubmitted implements IEvent<IPendingQuote> {
  constructor(private created: IPendingQuote) {}

  readonly eventName = 'QUOTE_SUBMITTED'

  get aggregateId() {
    return this.created.quoteId
  }

  get payload() {
    return this.created
  }
}
