import { AggregateRoot } from '@nestjs/cqrs'
import { v4 } from 'uuid'
import { QuoteReceived } from './quote-received.event'

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
  submitDt: string
  guildId: string
  acceptDt: Date

  receives: IQuoteReceive[]
}

export class Quote extends AggregateRoot implements IQuote {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: string
  guildId: string
  acceptDt: Date
  receives

  receive(newReceive: INewReceive) {
    const { quoteId } = this
    const receive: IQuoteReceive = {
      receiveDt: new Date(),
      userId: newReceive.userId,
      receiveId: v4(),
    }

    this.receives.push(receive)
    this.apply(
      new QuoteReceived({
        ...receive,
        ...newReceive,
        quoteId,
      }),
    )
  }
}
