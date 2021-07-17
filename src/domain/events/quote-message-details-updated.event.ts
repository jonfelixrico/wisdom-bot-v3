import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { EventPayload } from './event-payload.type'

export interface IQuoteMessageDetailsUpdatedPayload extends EventPayload {
  quoteId: string
  messageId: string
  channelId: string
}

export class QuoteMessageDetailsUpdatedEvent extends DomainEvent<IQuoteMessageDetailsUpdatedPayload> {
  constructor(payload: IQuoteMessageDetailsUpdatedPayload) {
    super(
      DomainEventNames.QUOTE_MESSAGE_DETAILS_UPDATED,
      payload.quoteId,
      payload,
    )
  }
}
