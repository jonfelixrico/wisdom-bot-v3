import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

export interface IReceiveInteractedPayload {
  readonly interactionId: string
  readonly interactionDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class ReceiveInteractedEvent extends DomainEvent<IReceiveInteractedPayload> {
  constructor(interaction: IReceiveInteractedPayload) {
    super(
      DomainEventNames.RECEIVE_INTERACTED,
      interaction.receiveId,
      interaction,
    )
  }
}
