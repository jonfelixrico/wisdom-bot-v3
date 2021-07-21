import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'
import { EventPayload } from './event-payload.type'

export interface IReceiveInteractedPayload extends EventPayload {
  readonly interactionId: string
  readonly interactionDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class ReceiveInteractedEvent extends DomainEvent<IReceiveInteractedPayload> {
  constructor(interaction: IReceiveInteractedPayload) {
    super(DomainEventNames.RECEIVE_REACTED, interaction.receiveId, interaction)
  }
}
