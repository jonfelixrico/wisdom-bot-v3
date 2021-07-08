import { AggregateRoot } from '@nestjs/cqrs'
import { v4 } from 'uuid'
import { ReceiveInteractedEvent } from '../events/receive-interacted.event'

export interface IInteraction {
  readonly interactionId: string
  readonly userId: string
  readonly interactDt: Date
  readonly karma: number
}

export interface IReceiveAggregate {
  receiveId: string
  quoteId: string
  channelId: string
  messageId: string

  interactions: IInteraction[]
}

interface INewInteraction {
  readonly userId: string
  readonly karma: number
}

export class Receive extends AggregateRoot implements IReceiveAggregate {
  receiveId: string
  quoteId: string
  channelId: string
  messageId: string
  interactions: IInteraction[]

  constructor({
    channelId,
    interactions,
    messageId,
    quoteId,
    receiveId,
  }: IReceiveAggregate) {
    super()
    this.channelId = channelId
    this.interactions = interactions || []
    this.messageId = messageId
    this.quoteId = quoteId
    this.receiveId = receiveId
  }

  interact({ karma = 1, userId }: INewInteraction) {
    if (karma === 0) {
      throw new Error('Karma cannot be 0.')
    }

    const newInteraction: IInteraction = {
      interactionId: v4(),
      interactDt: new Date(),
      karma,
      userId,
    }

    this.interactions.push(newInteraction)

    const { receiveId, quoteId } = this
    this.apply(
      new ReceiveInteractedEvent({
        ...newInteraction,
        receiveId,
        quoteId,
      }),
    )
  }
}
