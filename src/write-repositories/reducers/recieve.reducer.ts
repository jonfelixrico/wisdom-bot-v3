import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveReactedPayload } from 'src/domain/events/receive-reacted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const create: WriteRepositoryReducer<IReceiveCreatedPayload, IReceiveEntity> = (
  data,
) => {
  return {
    ...data,
    reactions: [],
  }
}

const interact: WriteRepositoryReducer<IReceiveReactedPayload, IReceiveEntity> =
  ({ receiveId, reactionId, userId, karma }, { reactions, ...state }) => {
    return {
      ...state,
      reactions: [...reactions, { receiveId, reactionId, userId, karma }],
    }
  }

const { RECEIVE_CREATED, RECEIVE_REACTED } = DomainEventNames
export const RECEIVE_REDUCERS: WriteRepositoryReducerMap<IReceiveEntity> = {
  [RECEIVE_CREATED]: create,
  [RECEIVE_REACTED]: interact,
}
