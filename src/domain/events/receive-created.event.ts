import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

interface IBasePayload extends EventPayload {
  readonly receiveId: string
  readonly quoteId: string
  readonly userId: string
  readonly guildId: string
  readonly channelId: string
  readonly receiveDt: Date
}

interface IMessagePayload extends IBasePayload {
  messageId: string
}

interface IInteractionPayload extends IBasePayload {
  interactionToken: string
}

export type IReceiveCreatedPayload = IMessagePayload | IInteractionPayload

export class ReceiveCreatedEvent extends DomainEvent<IReceiveCreatedPayload> {
  constructor(receive: IReceiveCreatedPayload) {
    super(DomainEventNames.RECEIVE_CREATED, receive.receiveId, receive)
  }
}
