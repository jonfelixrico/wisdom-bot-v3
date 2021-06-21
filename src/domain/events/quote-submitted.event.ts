import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from '../entities/pending-quote.interface'
import { BasePendingQuoteEvent } from './base-pending-quote-event.abstract'

export type IQuoteSubmittedEventPayload = IPendingQuote

export class QuoteSubmittedEvent extends BasePendingQuoteEvent<IQuoteSubmittedEventPayload> {
  constructor(created: IQuoteSubmittedEventPayload) {
    super(DomainEventNames.QUOTE_SUBMITTED, created.quoteId, created)
  }
}
