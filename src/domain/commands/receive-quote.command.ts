import { ICommand } from '../command.interface'

export interface IReceiveQuoteCommandPayload {
  readonly quoteId: string
  readonly channelId: string
  readonly userId: string
  readonly messageId?: string
  readonly interactionToken?: string
}

export class ReceiveQuoteCommand
  implements ICommand<IReceiveQuoteCommandPayload>
{
  constructor(readonly payload: IReceiveQuoteCommandPayload) {}
}
