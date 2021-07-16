import { ICommand } from 'src/domain/command.interface'

export interface IRegeneratePendingQuoteMessageCommand {
  quoteId: string
  upvoteCount: number
  upvoteEmoji: string
  expireDt: Date
  guildId: string
  channelId: string
}

export class RegeneratePendingQuoteMessageCommand
  implements ICommand<IRegeneratePendingQuoteMessageCommand>
{
  constructor(readonly payload: IRegeneratePendingQuoteMessageCommand) {}
}
