import { v4 } from 'uuid'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { ReceiveCreatedEvent } from '../events/receive-created.event'

interface IQuoteReceiveInput {
  readonly userId: string
  readonly messageId: string
  readonly channelId: string
}

export interface IQuoteEntity {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string
  acceptDt: Date

  receives: IQuoteReceive[]
}

interface IQuoteReceive {
  readonly receiveId: string
}

export class Quote extends DomainEntity implements IQuoteEntity {
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
  }: IQuoteEntity) {
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

  receive(newReceive: IQuoteReceiveInput) {
    const { quoteId, guildId } = this
    const receiveDt = new Date()
    const receiveId = v4()

    this.receives.push({ receiveId })

    this.apply(
      new ReceiveCreatedEvent({
        ...newReceive,
        receiveId,
        quoteId,
        receiveDt,
        guildId,
      }),
    )
  }
}
