import { Event } from 'src/domain/event.abstract'
import { IPendingQuote } from './pending-quote.interface'

export class QuoteSubmitted extends Event<IPendingQuote> {
  constructor(created: IPendingQuote) {
    super('QUOTE_SUBMITTED', created.quoteId, created)
  }
}
