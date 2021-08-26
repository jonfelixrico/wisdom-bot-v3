import { ICommand } from '../command.interface'

export interface IUpdateQuoteMessageDetailsCommandPayload {
  quoteId: string
  messageId: string
  channelId: string
}

export class UpdateQuoteMessageDetailsCommand
  implements ICommand<IUpdateQuoteMessageDetailsCommandPayload>
{
  constructor(readonly payload: IUpdateQuoteMessageDetailsCommandPayload) {}
}
