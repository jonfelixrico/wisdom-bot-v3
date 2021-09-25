import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IReceiveReactionWithdrawnEventPayload extends EventPayload {
  readonly receiveId: string
  readonly userId: string
  readonly oldKarma: -1 | 1
  readonly reactionRemoveDt: Date
}

export class ReceiveReactionWithdrawnEvent extends DomainEvent<IReceiveReactionWithdrawnEventPayload> {
  constructor(reaction: IReceiveReactionWithdrawnEventPayload) {
    super(
      DomainEventNames.RECEIVE_REACTION_WITHDRAWN,
      reaction.receiveId,
      reaction,
    )
  }
}
