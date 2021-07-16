import { ICommand } from '../command.interface'

export interface IUpdateQuoteMessageIdCommand {
  quoteId: string
  messageId: string
}

export class UpdateQuoteMessageIdCommand
  implements ICommand<IUpdateQuoteMessageIdCommand>
{
  constructor(readonly payload: IUpdateQuoteMessageIdCommand) {}
}
