import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export interface IReceiveCreatedPayload {
  readonly receiveId: string
  readonly quoteId: string
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
  readonly receivedt: Date
}

export class ReceiveCreatedEvent extends DomainEvent<IReceiveCreatedPayload> {
  constructor(receive: IReceiveCreatedPayload) {
    super(DomainEventNames.RECEIVE_CREATED, receive.receiveId, receive)
  }
}
