import { v4 } from 'uuid'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'
import { ReceiveReactedEvent } from '../events/receive-reacted.event'

const {
  REACTION_DUPLICATE_USER: INTERACTION_DUPLICATE_USER,
  REACTION_INVALID_KARMA: INTERACTION_INVALID_KARMA,
} = DomainErrorCodes

interface IReaction {
  readonly reactionId: string
  readonly userId: string
  readonly karma: number
}

export interface IReceiveEntity {
  receiveId: string
  quoteId: string
  guildId: string
  channelId: string
  messageId: string

  reactions: IReaction[]
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
  reactions: IReaction[]
  guildId: string

  constructor({
    channelId,
    reactions,
    messageId,
    quoteId,
    receiveId,
  }: IReceiveEntity) {
    super()
    this.channelId = channelId
    this.reactions = reactions || []
    this.messageId = messageId
    this.quoteId = quoteId
    this.receiveId = receiveId
  }

  react({ karma = 1, userId }: IReceiveInteractInput) {
    const { reactions } = this
    if (karma === 0) {
      throw new DomainError(INTERACTION_INVALID_KARMA)
    } else if (reactions.some((reaction) => reaction.userId === userId)) {
      throw new DomainError(INTERACTION_DUPLICATE_USER)
    }

    const reactionDt = new Date()
    const reactionId = v4()

    reactions.push({
      reactionId,
      userId,
      karma,
    })

    const { receiveId } = this
    this.apply(
      new ReceiveReactedEvent({
        reactionDt,
        reactionId,
        receiveId,
        karma,
        userId,
      }),
    )
  }
}
