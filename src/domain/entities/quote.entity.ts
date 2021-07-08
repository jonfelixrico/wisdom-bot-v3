import { AggregateRoot } from '@nestjs/cqrs'
import { v4 } from 'uuid'
import { QuoteReceivedEvent } from '../events/quote-received.event'

export interface IQuoteReceive {
  readonly receiveId: string
  readonly receiveDt: Date
  readonly userId: string
}

interface INewReceive {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
}

interface IQuote {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string
  acceptDt: Date

  receives: IQuoteReceive[]
}

export class Quote extends AggregateRoot implements IQuote {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string
  acceptDt: Date
  receives: IQuoteReceive[]

  constructor({
    acceptDt,
    authorId,
    content,
    guildId,
    quoteId,
    receives,
    submitDt,
    submitterId,
  }: IQuote) {
    super()
    this.acceptDt = acceptDt
    this.authorId = authorId
    this.content = content
    this.guildId = guildId
    this.receives = receives || []
    this.quoteId = quoteId
    this.submitDt = submitDt
    this.submitterId = submitterId
  }

  receive(newReceive: INewReceive) {
    const { quoteId } = this
    const receive: IQuoteReceive = {
      receiveDt: new Date(),
      userId: newReceive.userId,
      receiveId: v4(),
    }

    this.receives.push(receive)
    this.apply(
      new QuoteReceivedEvent({
        ...receive,
        ...newReceive,
        quoteId,
      }),
    )
  }
}
