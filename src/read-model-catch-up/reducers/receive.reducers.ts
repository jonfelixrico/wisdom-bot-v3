import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveReactedPayload } from 'src/domain/events/receive-reacted.event'
import { ReactionTypeormEntity } from 'src/typeorm/entities/reaction.typeorm-entity'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import {
  TypeormReducerMap,
  TypeormReducer,
} from '../../types/typeorm-reducers.types'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { IReceiveReactionWithdrawnEventPayload } from 'src/domain/events/receive-reaction-withdrawn.event'
import { IReceiveMessageDetailsUpdatedPayload } from 'src/domain/events/receive-message-details-updated.event'

const created: TypeormReducer<IReceiveCreatedPayload> = async (
  { data, revision },
  manager,
) => {
  const {
    channelId,
    messageId,
    quoteId,
    receiveDt,
    receiveId,
    userId,
    guildId,
    interactionToken,
  } = data

  const quote = await manager.findOne(QuoteTypeormEntity, {
    id: quoteId,
  })

  if (!quote) {
    return false
  }

  const receiveCount = await manager.count(QuoteTypeormEntity, {
    where: { id: quoteId },
  })

  await manager.insert(ReceiveTypeormEntity, {
    id: receiveId,
    channelId,
    messageId,
    guildId,
    quoteId,
    receiveDt,
    userId,
    revision,
    receiveCountSnapshot: receiveCount + 1,
    interactionToken,
  })

  return true
}

const reacted: TypeormReducer<IReceiveReactedPayload> = async (
  { revision, data },
  manager,
) => {
  const { reactionDt, karma, receiveId, userId } = data

  const { affected } = await manager.update(
    ReceiveTypeormEntity,
    {
      id: receiveId,
      revision: revision - 1n,
    },
    {
      revision,
    },
  )

  if (!affected) {
    return false
  }

  await manager.insert(ReactionTypeormEntity, {
    reactionDt,
    id: [receiveId, userId].join('/'),
    karma,
    userId,
    receiveId,
  })

  return true
}

const reactionWithdrawn: TypeormReducer<IReceiveReactionWithdrawnEventPayload> =
  async ({ data, revision }, manager) => {
    const { receiveId, userId } = data

    const { affected } = await manager.update(
      ReceiveTypeormEntity,
      {
        id: receiveId,
        revision: revision - 1n,
      },
      {
        revision,
      },
    )

    if (!affected) {
      return false
    }

    await manager.getRepository(ReactionTypeormEntity).delete({
      id: [receiveId, userId].join('/'),
    })

    return true
  }

const messageUpdated: TypeormReducer<IReceiveMessageDetailsUpdatedPayload> =
  async ({ data, revision }, manager) => {
    const { receiveId, ...otherData } = data

    const { affected } = await manager
      .getRepository(ReceiveTypeormEntity)
      .update(
        {
          ...otherData,
          revision,
        },
        {
          revision: revision - 1n,
          id: receiveId,
        },
      )

    return !!affected
  }

const {
  RECEIVE_CREATED,
  RECEIVE_REACTED,
  RECEIVE_REACTION_WITHDRAWN,
  RECEIVE_MESSAGE_DETAILS_UPDATED,
} = DomainEventNames

export const RECEIVE_REDUCERS: TypeormReducerMap = Object.freeze({
  [RECEIVE_CREATED]: created,
  [RECEIVE_REACTED]: reacted,
  [RECEIVE_REACTION_WITHDRAWN]: reactionWithdrawn,
  [RECEIVE_MESSAGE_DETAILS_UPDATED]: messageUpdated,
})
