import { isNil, omit, omitBy } from 'lodash'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IReceiveEntity } from 'src/domain/entities/receive.entity'
import { IReceiveCreatedPayload } from 'src/domain/events/receive-created.event'
import { IReceiveMessageDetailsUpdatedPayload } from 'src/domain/events/receive-message-details-updated.event'
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

const messageUpdated: WriteRepositoryReducer<
  IReceiveMessageDetailsUpdatedPayload,
  IReceiveEntity
> = (data, state) => {
  return {
    ...state,
    ...omitBy(omit(data, 'receiveId'), isNil),
  }
}

const {
  RECEIVE_CREATED,
  RECEIVE_REACTED,
  RECEIVE_REACTION_WITHDRAWN,
  RECEIVE_MESSAGE_DETAILS_UPDATED,
} = DomainEventNames
export const RECEIVE_REDUCERS: WriteRepositoryReducerMap<IReceiveEntity> = {
  [RECEIVE_CREATED]: create,
  [RECEIVE_REACTED]: react,
  [RECEIVE_REACTION_WITHDRAWN]: reactionWithdrawn,
  [RECEIVE_MESSAGE_DETAILS_UPDATED]: messageUpdated,
}
