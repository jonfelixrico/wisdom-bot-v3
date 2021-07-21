import { v4 } from 'uuid'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'
import { ReceiveInteractedEvent } from '../events/receive-interacted.event'

const {
  REACTION_DUPLICATE_USER: INTERACTION_DUPLICATE_USER,
  REACTION_INVALID_KARMA: INTERACTION_INVALID_KARMA,
} = DomainErrorCodes

interface IInteraction {
  readonly interactionId: string
  readonly userId: string
  readonly karma: number
}

export interface IReceiveEntity {
  receiveId: string
  quoteId: string
  guildId: string
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
  guildId: string

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
      throw new DomainError(INTERACTION_INVALID_KARMA)
    } else if (
      interactions.some((interaction) => interaction.userId === userId)
    ) {
      throw new DomainError(INTERACTION_DUPLICATE_USER)
    }

    const interactionDt = new Date()
    const interactionId = v4()

    interactions.push({
      interactionId,
      userId,
      karma,
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
