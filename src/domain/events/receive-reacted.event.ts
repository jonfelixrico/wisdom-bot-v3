import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IReceiveReactedPayload extends EventPayload {
  readonly reactionId: string
  readonly reactionDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class ReceiveReactedEvent extends DomainEvent<IReceiveReactedPayload> {
  constructor(reaction: IReceiveReactedPayload) {
    super(DomainEventNames.RECEIVE_REACTED, reaction.receiveId, reaction)
  }
}
