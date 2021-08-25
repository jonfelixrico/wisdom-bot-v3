import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { DomainEvent } from '../abstracts/domain-event.abstract'
import { EventPayload } from './event-payload.type'

export interface IReceiveMessageDetailsUpdatedPayload extends EventPayload {
  quoteId: string
  messageId: string
  channelId: string
}

export class ReceiveMessageDetailsUpdatedEvent extends DomainEvent<IReceiveMessageDetailsUpdatedPayload> {
  constructor(payload: IReceiveMessageDetailsUpdatedPayload) {
    super(
      DomainEventNames.RECEIVE_MESSAGE_DETAILS_UPDATED,
      payload.quoteId,
      payload,
    )
  }
}
