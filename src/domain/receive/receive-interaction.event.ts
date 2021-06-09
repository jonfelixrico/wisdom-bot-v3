interface IInteraction {
  readonly interactionId: string
  readonly interactDt: Date
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class ReceiveInteraction {
  constructor(readonly interaction: IInteraction) {}
}
