import { ICommand } from '@nestjs/cqrs'

export interface ISendQuoteAcceptedNotificationCommandPayload {
  /*
   * This is expected to be the id of a message under `channelId`.
   * If provided, then we will attempt to delete that message.
   */
  messageId?: string
  channelId: string
  guildId: string
  quote: {
    content: string
    year: number
    authorId: string
    submitterId: string
  }
}

export class SendQuoteAcceptedNotificationCommand implements ICommand {
  constructor(readonly payload: ISendQuoteAcceptedNotificationCommandPayload) {}
}
