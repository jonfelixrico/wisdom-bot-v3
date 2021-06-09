import { AggregateRoot } from '@nestjs/cqrs'
import { v4 } from 'uuid'
import { ReceiveInteraction } from './receive-interaction.event'

interface IInteraction {
  readonly interactionId: string
  readonly userId: string
  readonly interactDt: Date
  readonly karma: number
}

interface IReceive {
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

export class Receive extends AggregateRoot implements IReceive {
  receiveId: string
  quoteId: string
  channelId: string
  messageId: string
  interactions: IInteraction[]

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
      new ReceiveInteraction({
        ...newInteraction,
        receiveId,
        quoteId,
      }),
    )
  }
}
