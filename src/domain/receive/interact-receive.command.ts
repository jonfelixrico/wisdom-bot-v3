import { ICommand } from '../command.interface'

interface IInteraction {
  readonly quoteId: string
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class InteractRecieve implements ICommand<IInteraction> {
  constructor(readonly payload: IInteraction) {}
}
