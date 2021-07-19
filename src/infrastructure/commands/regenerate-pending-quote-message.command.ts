import { ICommand } from 'src/domain/command.interface'

export interface IRegeneratePendingQuoteMessageCommand {
  quoteId: string
}

export class RegeneratePendingQuoteMessageCommand
  implements ICommand<IRegeneratePendingQuoteMessageCommand>
{
  constructor(readonly payload: IRegeneratePendingQuoteMessageCommand) {}
}
