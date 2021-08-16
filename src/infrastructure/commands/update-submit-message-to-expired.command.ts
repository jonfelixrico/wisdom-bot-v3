import { ICommand } from '@nestjs/cqrs'

export interface IUpdateSubmitMessageAsExpiredCommandPayload {
  messageId: string
  channelId: string
  guildId: string

  content: string
  submitDt: Date
  authorId: string
  submitterId: string

  expireDt: Date

  upvoteCount: number
}
export class UpdateSubmitMessageAsExpiredCommand implements ICommand {
  constructor(readonly payload: IUpdateSubmitMessageAsExpiredCommandPayload) {}
}
