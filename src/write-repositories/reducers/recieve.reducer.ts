import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveReactedPayload } from 'src/domain/events/receive-reacted.event'
import { IReceiveReactionWithdrawnEventPayload } from 'src/domain/events/receive-reaction-withdrawn.event'
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

const react: WriteRepositoryReducer<IReceiveReactedPayload, IReceiveEntity> = (
  { receiveId, userId, karma },
  { reactions, ...state },
) => {
  return {
    ...state,
    reactions: [...reactions, { receiveId, userId, karma }],
  }
}

const reactionWithdrawn: WriteRepositoryReducer<
  IReceiveReactionWithdrawnEventPayload,
  IReceiveEntity
> = ({ userId }, { reactions, ...state }) => {
  const index = reactions.findIndex((reaction) => reaction.userId === userId)

  if (index === -1) {
    return {
      ...state,
      reactions,
    }
  }

  // Good practice to not mutate the original array; Array#splice is a mutating method
  const clone = [...reactions]
  clone.splice(index, 1)

  return {
    ...state,
    reactions: clone,
  }
}

const { RECEIVE_CREATED, RECEIVE_REACTED, RECEIVE_REACTION_WITHDRAWN } =
  DomainEventNames
export const RECEIVE_REDUCERS: WriteRepositoryReducerMap<IReceiveEntity> = {
  [RECEIVE_CREATED]: create,
  [RECEIVE_REACTED]: react,
  [RECEIVE_REACTION_WITHDRAWN]: reactionWithdrawn,
}
