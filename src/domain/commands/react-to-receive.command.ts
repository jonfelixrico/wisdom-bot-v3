import { Karma } from 'src/domain/common/karma.type'
import { ICommand } from '../command.interface'

export interface IReactToReceiveCommandPayload {
  readonly receiveId: string
  readonly userId: string
  readonly karma: Karma
}

export class ReactToReceiveCommand
  implements ICommand<IReactToReceiveCommandPayload>
{
  constructor(readonly payload: IReactToReceiveCommandPayload) {}
}
