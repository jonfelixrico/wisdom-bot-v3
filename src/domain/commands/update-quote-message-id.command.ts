import { ICommand } from '../command.interface'

export interface IUpdateQuoteMessageDetailsCommand {
  quoteId: string
  messageId: string
  channelId: string
}

export class UpdateQuoteMessageDetailsCommand
  implements ICommand<IUpdateQuoteMessageDetailsCommand>
{
  constructor(readonly payload: IUpdateQuoteMessageDetailsCommand) {}
}
