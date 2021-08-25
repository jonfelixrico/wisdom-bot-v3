import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'
import { ReceiveReactedEvent } from '../events/receive-reacted.event'
import { ReceiveReactionWithdrawnEvent } from '../events/receive-reaction-withdrawn.event'

const {
  REACTION_DUPLICATE_USER,
  REACTION_INVALID_KARMA,
  REACTION_USER_NOT_REACTED,
} = DomainErrorCodes

interface IReaction {
  readonly userId: string
  readonly karma: number
}

export interface IReceiveEntity {
  receiveId: string
  receiveDt: Date
  quoteId: string
  guildId: string
  channelId: string
  messageId: string
  userId: string

  reactions: IReaction[]
}

interface IReceiveReactionInput {
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
  receiveDt: Date
  userId: string

  constructor({
    channelId,
    reactions,
    messageId,
    quoteId,
    receiveId,
    receiveDt,
  }: IReceiveEntity) {
    super()
    this.channelId = channelId
    this.reactions = reactions || []
    this.messageId = messageId
    this.quoteId = quoteId
    this.receiveId = receiveId
    this.receiveDt = receiveDt
  }

  hasUserReacted(userId): boolean {
    return this.reactions.some((reaction) => reaction.userId === userId)
  }

  react({ karma = 1, userId }: IReceiveReactionInput) {
    const { reactions } = this
    if (karma === 0) {
      throw new DomainError(REACTION_INVALID_KARMA)
    } else if (this.hasUserReacted(userId)) {
      throw new DomainError(REACTION_DUPLICATE_USER)
    }

    const reactionDt = new Date()

    reactions.push({
      userId,
      karma,
    })

    const { receiveId } = this
    this.apply(
      new ReceiveReactedEvent({
        reactionDt,
        receiveId,
        karma,
        userId,
      }),
    )
  }

  withdrawReaction(userId: string) {
    const { receiveId, reactions } = this

    const index = reactions.findIndex((r) => r.userId === userId)

    if (index === -1) {
      throw new DomainError(REACTION_USER_NOT_REACTED)
    }

    reactions.splice(index, 1)

    this.apply(
      new ReceiveReactionWithdrawnEvent({
        receiveId,
        userId,
      }),
    )
  }
}
