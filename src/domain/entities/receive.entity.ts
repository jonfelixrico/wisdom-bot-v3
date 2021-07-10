import { v4 } from 'uuid'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { ReceiveInteractedEvent } from '../events/receive-interacted.event'

interface IInteraction {
  readonly interactionId: string
  readonly userId: string
}

export interface IReceiveEntity {
  receiveId: string
  quoteId: string
  channelId: string
  messageId: string

  interactions: IInteraction[]
}

interface IReceiveInteractInput {
  readonly userId: string
  readonly karma: number
}

export class Receive extends DomainEntity implements IReceiveEntity {
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
  }: IReceiveEntity) {
    super()
    this.channelId = channelId
    this.interactions = interactions || []
    this.messageId = messageId
    this.quoteId = quoteId
    this.receiveId = receiveId
  }

  interact({ karma = 1, userId }: IReceiveInteractInput) {
    const { interactions } = this
    if (karma === 0) {
      throw new Error('Karma cannot be 0.')
    } else if (
      interactions.some((interaction) => interaction.userId === userId)
    ) {
      throw new Error('Each user can only interact with a received quote once.')
    }

    const interactionDt = new Date()
    const interactionId = v4()

    interactions.push({
      interactionId,
      userId,
    })

    const { receiveId } = this
    this.apply(
      new ReceiveInteractedEvent({
        interactionDt,
        interactionId,
        receiveId,
        karma,
        userId,
      }),
    )
  }
}
