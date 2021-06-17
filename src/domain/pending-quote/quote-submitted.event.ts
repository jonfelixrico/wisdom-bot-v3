import { DomainEvent } from 'src/domain/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { IPendingQuote } from './pending-quote.interface'

export class QuoteSubmitted extends DomainEvent<IPendingQuote> {
  constructor(created: IPendingQuote) {
    super(DomainEventNames.QUOTE_SUBMITTED, created.quoteId, created)
  }
}
