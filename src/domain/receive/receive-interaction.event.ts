interface IInteraction {
  readonly interactionId: string
  readonly interactDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
  readonly quoteId: string
}

export class ReceiveInteraction {
  constructor(readonly interaction: IInteraction) {}
}
