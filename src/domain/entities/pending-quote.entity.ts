interface IQuoteToSubmit {
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

interface IPendingQuote extends IQuoteToSubmit {
  quoteId: string

  approveDt: Date
  cancelDt: Date
}

export class PendingQuote implements IPendingQuote {
  quoteId: string
  approveDt: Date
  cancelDt: Date
  content: string
  authorId: string
  submitterId: string
  submitDt: string
  guildId: string
  channelId: string
  messageId: string
  expireDt: Date
  upvoteCount: number
  upvoteEmoji: string

  get isExpired() {
    return new Date() > this.expireDt
  }

  private checkIfPending(): void {
    const { approveDt, cancelDt, isExpired } = this

    if (!!approveDt) {
      throw new Error('Already approved.')
    } else if (!!cancelDt) {
      throw new Error('Already cancelled.')
    } else if (isExpired) {
      throw new Error('Already expired.')
    }
  }

  approve() {
    this.checkIfPending()
    this.approveDt = new Date()
  }

  cancel() {
    this.checkIfPending()
    this.cancelDt = new Date()
  }
}
