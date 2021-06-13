import { DomainEvent } from 'src/domain/domain-event.abstract'

interface IInteraction {
  readonly interactionId: string
  readonly interactDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
  readonly quoteId: string
}

export class ReceiveInteracted extends DomainEvent<IInteraction> {
  constructor(interaction: IInteraction) {
    super('RECEIVE_INTERACTED', interaction.quoteId, interaction)
  }
}
