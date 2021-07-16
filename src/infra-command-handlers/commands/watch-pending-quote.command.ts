import { Message } from 'discord.js'
import { ICommand } from 'src/domain/command.interface'

export interface IWatchPendingQuoteCommandPayload {
  quoteId: string
  message: Message
}

export class WatchPendingQuoteCommand
  implements ICommand<IWatchPendingQuoteCommandPayload>
{
  constructor(readonly payload: IWatchPendingQuoteCommandPayload) {}
}
