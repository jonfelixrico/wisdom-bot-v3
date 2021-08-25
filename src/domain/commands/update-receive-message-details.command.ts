import { ICommand } from '../command.interface'

export interface IUpdateReceiveMessageDetailsCommandPayload {
  quoteId: string
  messageId: string
  channelId: string
}

export class UpdateReceiveMessageDetailsCommand
  implements ICommand<IUpdateReceiveMessageDetailsCommandPayload>
{
  constructor(readonly payload: IUpdateReceiveMessageDetailsCommandPayload) {}
}
