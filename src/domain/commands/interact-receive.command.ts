import { ICommand } from '../command.interface'

export interface IInteractReceiveCommandPayload {
  readonly receiveId: string
  readonly userId: string
  readonly karma: number
}

export class InteractReceiveCommand
  implements ICommand<IInteractReceiveCommandPayload>
{
  constructor(readonly payload: IInteractReceiveCommandPayload) {}
}