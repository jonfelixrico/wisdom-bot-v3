import { ICommand } from '../command.interface'

export interface ISubmitQuoteCommandPayload {
  guildId: string
  content: string
  authorId: string
  submitterId: string

  // for tracking
  channelId?: string
  messageId?: string
}

export class SubmitQuoteCommand
  implements ICommand<ISubmitQuoteCommandPayload>
{
  constructor(readonly payload: ISubmitQuoteCommandPayload) {}
}
