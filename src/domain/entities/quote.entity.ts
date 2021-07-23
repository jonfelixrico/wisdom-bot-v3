import { v4 } from 'uuid'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { ReceiveCreatedEvent } from '../events/receive-created.event'
import { Receive } from './receive.entity'

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
}

export class Quote extends DomainEntity implements IQuoteEntity {
  quoteId: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  guildId: string
  acceptDt: Date

  constructor({
    acceptDt,
    authorId,
    content,
    guildId,
    quoteId,
    submitDt,
    submitterId,
  }: IQuoteEntity) {
    super()
    this.acceptDt = acceptDt
    this.authorId = authorId
    this.content = content
    this.guildId = guildId
    this.quoteId = quoteId
    this.submitDt = submitDt
    this.submitterId = submitterId
  }

  receive(newReceive: IQuoteReceiveInput) {
    const { quoteId, guildId } = this
    const receiveDt = new Date()
    const receiveId = v4()

    const receive = new Receive({
      ...newReceive,
      receiveId,
      quoteId,
      guildId,
      reactions: [],
      receiveDt,
    })

    receive.apply(
      new ReceiveCreatedEvent({
        ...newReceive,
        receiveId,
        quoteId,
        receiveDt,
        guildId,
      }),
    )

    return receive
  }
}
