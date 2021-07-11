import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { PendingQuoteAcceptedEvent } from '../events/pending-quote-accepted.event'
import { PendingQuoteCancelledEvent } from '../events/pending-quote-cancelled.event'
import { QuoteSubmittedEvent } from '../events/quote-submitted.event'
import { IPendingQuote } from './pending-quote.interface'
import { IQuoteToSubmit } from './quote-to-submit.interface'
import { v4 } from 'uuid'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'

const { QUOTE_APPROVED, QUOTE_CANCELLED, QUOTE_EXPIRED } = DomainErrorCodes

export class PendingQuote extends DomainEntity implements IPendingQuote {
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
      throw new DomainError(QUOTE_APPROVED)
    } else if (!!cancelDt) {
      throw new DomainError(QUOTE_CANCELLED)
    } else if (isExpired) {
      throw new DomainError(QUOTE_EXPIRED)
    }
  }

  /**
   * Flags a pending quote as accepted. Will fail if the quote is already cancelled, expired, or approved.
   */
  accept() {
    this.checkIfPending()
    const acceptDt = (this.acceptDt = new Date())
    const { quoteId } = this
    this.apply(new PendingQuoteAcceptedEvent({ quoteId, acceptDt }))
  }

  /**
   * Flags a pending quote as accepted. Assumes that cancellation is caused by the submitter themselves.
   * Will fail if the quote is already cancelled, expired, or approved.
   */
  cancel() {
    this.checkIfPending()
    const cancelDt = (this.cancelDt = new Date())
    const { quoteId } = this
    this.apply(new PendingQuoteCancelledEvent({ quoteId, cancelDt }))
  }

  /**
   * Creates a quote.
   * @param quote Data required to create a quote.
   */
  static submit(quote: IQuoteToSubmit) {
    const quoteId = v4()

    const submitEvent = new QuoteSubmittedEvent({
      ...quote,
      quoteId,
    })

    const entity = new PendingQuote({
      ...quote,
      quoteId,
      acceptDt: null,
      cancelDt: null,
    })

    entity.apply(submitEvent)

    return entity
  }
}
