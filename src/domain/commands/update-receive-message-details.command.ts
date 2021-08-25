import { ICommand } from '../command.interface'

export interface IUpdateReceiveMessageDetailsCommandPayload {
  receiveId: string
  messageId: string
  channelId: string
}

export class UpdateReceiveMessageDetailsCommand
  implements ICommand<IUpdateReceiveMessageDetailsCommandPayload>
{
  constructor(readonly payload: IUpdateReceiveMessageDetailsCommandPayload) {}
}
