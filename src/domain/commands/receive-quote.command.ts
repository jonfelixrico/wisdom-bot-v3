import { ICommand } from '../command.interface'

export interface IReceiveQuoteCommandPayload {
  readonly quoteId: string
  readonly messageId?: string
  readonly channelId: string
  readonly userId: string
}

export class ReceiveQuoteCommand
  implements ICommand<IReceiveQuoteCommandPayload>
{
  constructor(readonly payload: IReceiveQuoteCommandPayload) {}
}
