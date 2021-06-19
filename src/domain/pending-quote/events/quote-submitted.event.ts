import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from 'src/domain/pending-quote/pending-quote.interface'
import { BasePendingQuoteEvent } from './base-pending-quote-event.abstract'

export class QuoteSubmittedEvent extends BasePendingQuoteEvent<IPendingQuote> {
  constructor(created: IPendingQuote) {
    super(DomainEventNames.QUOTE_SUBMITTED, created.quoteId, created)
  }
}
