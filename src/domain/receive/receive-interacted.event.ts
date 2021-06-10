import { IEvent } from 'src/domain/event.interface'

interface IInteraction {
  readonly interactionId: string
  readonly interactDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
  readonly quoteId: string
}

export class ReceiveInteracted implements IEvent<IInteraction> {
  constructor(private interaction: IInteraction) {}

  readonly eventName = 'RECEIVE_INTERACTED'

  get aggregateId() {
    return this.interaction.quoteId
  }

  get payload() {
    return this.interaction
  }
}
