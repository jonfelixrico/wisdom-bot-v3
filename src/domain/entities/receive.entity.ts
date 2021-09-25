import { Karma } from 'src/domain/common/karma.type'
import { DomainEntity } from '../abstracts/domain-entity.abstract'
import { DomainErrorCodes } from '../errors/domain-error-codes.enum'
import { DomainError } from '../errors/domain-error.class'
import { ReceiveMessageDetailsUpdatedEvent } from '../events/receive-message-details-updated.event'
import { ReceiveReactedEvent } from '../events/receive-reacted.event'
import { ReceiveReactionWithdrawnEvent } from '../events/receive-reaction-withdrawn.event'

const {
  REACTION_DUPLICATE_USER,
  REACTION_INVALID_KARMA,
  REACTION_USER_NOT_REACTED,
} = DomainErrorCodes

interface IReaction {
  readonly userId: string
  readonly karma: Karma
}

interface IReceiveMessageDetails {
  channelId: string
  messageId: string
}

export interface IReceiveEntity {
  receiveId: string
  receiveDt: Date
  quoteId: string
  guildId: string
  channelId: string
  userId: string

  messageId?: string
  interactionToken?: string

  reactions: IReaction[]
}

export class Receive extends DomainEntity implements IReceiveEntity {
  receiveId: string
  quoteId: string
  channelId: string

  reactions: IReaction[]
  guildId: string
  receiveDt: Date
  userId: string

  messageId?: string
  interactionToken?: string

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

  react({ karma, userId }: IReaction) {
    const { reactions } = this
    const numericKarma = karma as number

    if (numericKarma !== 1 && numericKarma !== -1) {
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

    const reaction = reactions[index]
    reactions.splice(index, 1)

    this.apply(
      new ReceiveReactionWithdrawnEvent({
        receiveId,
        userId,
        reactionRemoveDt: new Date(),
        oldKarma: reaction.karma,
      }),
    )
  }

  updateMessageDetails({ messageId, channelId }: IReceiveMessageDetails) {
    const { receiveId } = this

    this.messageId = messageId ?? this.messageId
    this.channelId = channelId ?? this.channelId

    this.apply(
      new ReceiveMessageDetailsUpdatedEvent({
        receiveId,
        messageId,
        channelId,
      }),
    )
  }
}
