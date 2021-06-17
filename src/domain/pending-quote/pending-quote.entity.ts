import { AggregateRoot } from '@nestjs/cqrs'
import { PendingQuoteAccepted } from './pending-quote-accepted.event'
import { PendingQuoteCancelled } from './pending-quote-cancelled.event'
import { IPendingQuote } from './pending-quote.interface'

export class PendingQuote extends AggregateRoot implements IPendingQuote {
  quoteId: string
  acceptDt: Date
  cancelDt: Date
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string
  channelId: string
  messageId: string
  expireDt: Date
  upvoteCount: number
  upvoteEmoji: string

  // TODO create private flag for created

  constructor({
    quoteId,
    acceptDt,
    cancelDt,
    content,
    authorId,
    submitterId,
    submitDt,
    guildId,
    channelId,
    messageId,
    expireDt,
    upvoteCount,
    upvoteEmoji,
  }: IPendingQuote) {
    super()

    this.quoteId = quoteId
    this.acceptDt = acceptDt
    this.cancelDt = cancelDt
    this.content = content
    this.authorId = authorId
    this.submitterId = submitterId
    this.submitDt = submitDt
    this.guildId = guildId
    this.channelId = channelId
    this.messageId = messageId
    this.expireDt = expireDt
    this.upvoteCount = upvoteCount
    this.upvoteEmoji = upvoteEmoji
  }

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
    const acceptDt = (this.acceptDt = new Date())
    const { quoteId } = this
    this.apply(new PendingQuoteAccepted({ quoteId, acceptDt }))
  }

  cancel() {
    this.checkIfPending()
    const cancelDt = (this.cancelDt = new Date())
    const { quoteId } = this
    this.apply(new PendingQuoteCancelled({ quoteId, cancelDt }))
  }
}
