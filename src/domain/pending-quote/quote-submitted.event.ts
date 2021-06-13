import { DomainEvent } from 'src/domain/domain-event.abstract'
import { IPendingQuote } from './pending-quote.interface'

export class QuoteSubmitted extends DomainEvent<IPendingQuote> {
  constructor(created: IPendingQuote) {
    super('QUOTE_SUBMITTED', created.quoteId, created)
  }
}
