interface IInteraction {
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class InteractRecieve {
  constructor(readonly interaction: IInteraction) {}
}
