import { ICommand } from '../command.interface'

export interface ISubmitQuoteCommandPayload {
  quoteId: string
  guildId: string
  content: string
  authorId: string
  submitterId: string

  // for tracking
  channelId?: string
  messageId?: string
  interactionToken?: string
}

export class SubmitQuoteCommand
  implements ICommand<ISubmitQuoteCommandPayload>
{
  constructor(readonly payload: ISubmitQuoteCommandPayload) {}
}
