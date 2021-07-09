import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { IPendingQuote } from '../entities/pending-quote.interface'
import { EventPayload } from './event-payload.type'

export interface IQuoteSubmittedEventPayload
  extends EventPayload,
    IPendingQuote {}

export class QuoteSubmittedEvent extends DomainEvent<IQuoteSubmittedEventPayload> {
  constructor(created: IQuoteSubmittedEventPayload) {
    super(DomainEventNames.QUOTE_SUBMITTED, created.quoteId, created)
  }
}
