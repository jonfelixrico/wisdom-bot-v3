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
  } = data

  const quote = await manager.findOne(QuoteTypeormEntity, {
    id: quoteId,
  })

  if (!quote) {
    return false
  }

  await manager.insert(ReceiveTypeormEntity, {
    id: receiveId,
    channelId,
    messageId,
    guildId,
    quoteId,
    receiveDt,
    userId,
    revision,
  })

  return true
}

const reacted: TypeormReducer<IReceiveReactedPayload> = async (
  { revision, data },
  manager,
) => {
  const { reactionDt, reactionId, karma, receiveId, userId } = data

  const receive = await manager.findOne(ReceiveTypeormEntity, {
    id: receiveId,
  })

  if (!receive) {
    return false
  }

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
    id: reactionId,
    karma,
    userId,
    receiveId,
    guildId: receive.guildId,
  })

  return true
}

const { RECEIVE_CREATED, RECEIVE_REACTED } = DomainEventNames
export const RECEIVE_REDUCERS: TypeormReducerMap = Object.freeze({
  [RECEIVE_CREATED]: created,
  [RECEIVE_REACTED]: reacted,
})
