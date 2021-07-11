import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { IQuoteToSubmit } from '../entities/quote-to-submit.interface'
import { EventPayload } from './event-payload.type'

export interface IQuoteSubmittedEventPayload
  extends EventPayload,
    IQuoteToSubmit {
  quoteId: string
}

export class QuoteSubmittedEvent extends DomainEvent<IQuoteSubmittedEventPayload> {
  constructor(created: IQuoteSubmittedEventPayload) {
    super(DomainEventNames.QUOTE_SUBMITTED, created.quoteId, created)
  }
}
