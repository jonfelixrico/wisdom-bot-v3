import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IReceiveCreatedPayload extends EventPayload {
  readonly receiveId: string
  readonly quoteId: string
  readonly userId: string
  readonly messageId: string
  readonly guildId: string
  readonly channelId: string
  readonly receiveDt: Date
}

export class ReceiveCreatedEvent extends DomainEvent<IReceiveCreatedPayload> {
  constructor(receive: IReceiveCreatedPayload) {
    super(DomainEventNames.RECEIVE_CREATED, receive.receiveId, receive)
  }
}
