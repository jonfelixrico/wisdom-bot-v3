import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveReactedPayload } from 'src/domain/events/receive-interacted.event'
import { ReactionTypeormEntity } from 'src/typeorm/entities/interaction.typeorm-entity'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { ReadRepositoryReducer } from '../types/read-repository-reducer.type'
import { ReducerMap } from 'src/read-repositories/types/reducer-map.type'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'

const receiveCreated: ReadRepositoryReducer<IReceiveCreatedPayload> = async (
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
    parentQuoteAuthorId: quote.authorId,
  })

  return true
}

const receiveInteracted: ReadRepositoryReducer<IReceiveReactedPayload> = async (
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

  const { affected } = await manager
    .createQueryBuilder()
    .update(ReceiveTypeormEntity)
    .where('id = :receiveId AND revision = :revision', {
      receiveId,
      revision: revision - 1n,
    })
    .set({ revision })
    .execute()

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
    parentQuoteAuthorId: receive.parentQuoteAuthorId,
  })

  return true
}

const { RECEIVE_CREATED, RECEIVE_REACTED } = DomainEventNames
export const RECEIVE_REDUCERS: ReducerMap = Object.freeze({
  [RECEIVE_CREATED]: receiveCreated,
  [RECEIVE_REACTED]: receiveInteracted,
})
