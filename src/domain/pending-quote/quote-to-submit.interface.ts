export interface IQuoteToSubmit {
  content: string
  authorId: string
  submitterId: string
  submitDt: string
  guildId: string

  // for tracking
  channelId: string
  messageId: string

  // for approval/expiration
  expireDt: Date
  upvoteCount: number
  upvoteEmoji: string
}
