import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveInteractedPayload } from 'src/domain/events/receive-interacted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const create: WriteRepositoryReducer<IReceiveCreatedPayload, IReceiveEntity> = (
  data,
) => {
  return {
    ...data,
    interactions: [],
  }
}

const interact: WriteRepositoryReducer<
  IReceiveInteractedPayload,
  IReceiveEntity
> = (
  { receiveId, interactionId, userId, karma },
  { interactions, ...state },
) => {
  return {
    ...state,
    interactions: [
      ...interactions,
      { receiveId, interactionId, userId, karma },
    ],
  }
}

const { RECEIVE_CREATED, RECEIVE_INTERACTED } = DomainEventNames
export const RECEIVE_REDUCERS: WriteRepositoryReducerMap<IReceiveEntity> = {
  [RECEIVE_CREATED]: create,
  [RECEIVE_INTERACTED]: interact,
}
