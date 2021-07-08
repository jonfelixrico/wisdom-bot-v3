import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveInteractedPayload } from 'src/domain/events/receive-interacted.event'
import { InteractionTypeormEntity } from 'src/typeorm/entities/interaction.typeorm-entity'
import { ReceiveTypeormEntity } from 'src/typeorm/entities/receive.typeorm-entity'
import { ReadRepositoryReducer } from '../types/read-repository-reducer.type'

export const receiveCreated: ReadRepositoryReducer<IReceiveCreatedPayload> =
  async ({ data, revision }, manager) => {
    const {
      channelId,
      messageId,
      quoteId,
      receiveDt,
      receiveId,
      userId,
      guildId,
    } = data

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

export const receiveInteracted: ReadRepositoryReducer<IReceiveInteractedPayload> =
  async ({ revision, data }, manager) => {
    const { interactionDt, interactionId, karma, receiveId, userId } = data

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

    await manager.insert(InteractionTypeormEntity, {
      interactionDt,
      id: interactionId,
      karma,
      userId,
      receiveId,
    })

    return true
  }
