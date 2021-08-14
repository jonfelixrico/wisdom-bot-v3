import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { PendingQuoteAcceptedEvent } from '../events/pending-quote-accepted.event'
import { PendingQuoteCancelledEvent } from '../events/pending-quote-cancelled.event'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'
import { QuoteMessageDetailsUpdatedEvent } from '../events/quote-message-details-updated.event'
import { PendingQuoteExpirationAcknowledgedEvent } from '../events/pending-quote-expiration-acknowledged.event'

const {
  QUOTE_APPROVED,
  QUOTE_CANCELLED,
  QUOTE_EXPIRED,
  QUOTE_INVALID_EXPIRATION_ACK,
} = DomainErrorCodes

export interface IPendingQuote {
  quoteId: string

  // Optional because these are nullable.
  acceptDt?: Date
  cancelDt?: Date
  expireAckDt?: Date

  submitDt: Date

  content: string
  authorId: string
  submitterId: string
  guildId: string

  // for tracking
  channelId?: string
  messageId?: string

  // for approval/expiration
  expireDt: Date
  upvoteCount: number
}

export interface IQuoteMessageDetails {
  messageId?: string
  channelId?: string
}

export class PendingQuote extends DomainEntity implements IPendingQuote {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string

  expireDt: Date
  upvoteCount: number
  upvoteEmoji: string

  channelId?: string
  messageId?: string

  // These are pending quote status flags
  acceptDt?: Date
  cancelDt?: Date
  expireAckDt?: Date

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
  }

  get isExpired() {
    return new Date() > this.expireDt
  }

  private checkIfPending(): void {
    const { acceptDt, cancelDt, isExpired } = this

    if (!!acceptDt) {
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

  updateMessageDetails({ messageId, channelId }: IQuoteMessageDetails) {
    this.checkIfPending()

    this.messageId = messageId ?? this.messageId
    this.channelId = channelId ?? this.channelId

    const { quoteId } = this
    this.apply(
      new QuoteMessageDetailsUpdatedEvent({ quoteId, messageId, channelId }),
    )
  }

  /**
   * Populates the `expireAckDate` flag. Will throw an error if the expiration date
   * has not yet lapsed, or if the quote has already been cancelled or approved.
   */
  acknowledgeExpiration() {
    const { quoteId, expireDt, acceptDt, cancelDt } = this
    const now = new Date()

    if (now <= expireDt) {
      throw new DomainError(QUOTE_INVALID_EXPIRATION_ACK)
    } else if (!!acceptDt) {
      throw new DomainError(QUOTE_APPROVED)
    } else if (!!cancelDt) {
      throw new DomainError(QUOTE_CANCELLED)
    }

    this.apply(
      new PendingQuoteExpirationAcknowledgedEvent({
        quoteId,
        expireAckDt: now,
      }),
    )
  }
}
