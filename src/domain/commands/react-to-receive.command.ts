import { ICommand } from '../command.interface'

export interface IReactToReceiveCommandPayload {
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class ReactionToReceiveCommand
  implements ICommand<IReactToReceiveCommandPayload>
{
  constructor(readonly payload: IReactToReceiveCommandPayload) {}
}
