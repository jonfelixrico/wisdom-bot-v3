import { ICommand } from '../command.interface'

interface IBasePayload {
  readonly quoteId: string
  readonly channelId: string
  readonly userId: string
}

interface IMessagePayload extends IBasePayload {
  messageId: string
}

interface IInteractionPayload extends IBasePayload {
  interactionToken: string
}
export type IReceiveQuoteCommandPayload = IMessagePayload | IInteractionPayload

export class ReceiveQuoteCommand
  implements ICommand<IReceiveQuoteCommandPayload>
{
  constructor(readonly payload: IReceiveQuoteCommandPayload) {}
}
