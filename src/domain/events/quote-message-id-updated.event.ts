import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { EventPayload } from './event-payload.type'

export interface IQuoteMessageIdUpdatedPayload extends EventPayload {
  quoteId: string
  messageId: string
}

export class QuoteMessageIdUpdatedEvent extends DomainEvent<IQuoteMessageIdUpdatedPayload> {
  constructor(payload: IQuoteMessageIdUpdatedPayload) {
    super(
      DomainEventNames.QUOTE_MESSAGE_DETAILS_UPDATED,
      payload.quoteId,
      payload,
    )
  }
}
