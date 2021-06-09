import { AggregateRoot } from '@nestjs/cqrs'
import { PendingQuoteAccepted } from './pending-quote-accepted.event'
import { PendingQuoteCancelled } from './pending-quote-cancelled.event'

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

  acceptDt: Date
  cancelDt: Date
}

export class PendingQuote extends AggregateRoot implements IPendingQuote {
  quoteId: string
  acceptDt: Date
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
    const { acceptDt: approveDt, cancelDt, isExpired } = this

    if (!!approveDt) {
      throw new Error('Already approved.')
    } else if (!!cancelDt) {
      throw new Error('Already cancelled.')
    } else if (isExpired) {
      throw new Error('Already expired.')
    }
  }

  accept() {
    this.checkIfPending()
    this.acceptDt = new Date()
    this.apply(new PendingQuoteAccepted(this.quoteId))
  }

  cancel() {
    this.checkIfPending()
    this.cancelDt = new Date()
    this.apply(new PendingQuoteCancelled(this.quoteId))
  }
}
