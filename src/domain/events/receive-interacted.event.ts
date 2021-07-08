import { DomainEvent } from '../abstracts/domain-event.abstract'
import { DomainEventNames } from '../domain-event-names.enum'

interface IReceiveInteractedPayload {
  readonly interactionId: string
  readonly interactDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
  readonly quoteId: string
}

export class ReceiveInteractedEvent extends DomainEvent<IReceiveInteractedPayload> {
  constructor(interaction: IReceiveInteractedPayload) {
    super(DomainEventNames.RECEIVE_INTERACTED, interaction.quoteId, interaction)
  }
}
