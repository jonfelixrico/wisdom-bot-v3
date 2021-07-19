import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteEntity } from 'src/domain/entities/quote.entity'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IQuoteReceivedPayload } from 'src/domain/events/quote-received.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const received: WriteRepositoryReducer<IQuoteReceivedPayload, IQuoteEntity> = (
  { receiveId },
  { receives = [], ...state },
) => {
  return {
    ...state,
    receives: [...receives, { receiveId }],
  }
}

const submitted: WriteRepositoryReducer<
  IQuoteSubmittedEventPayload,
  IQuoteEntity
> = ({ submitDt, ...data }) => {
  return {
    ...data,
    receives: [],
    acceptDt: null,
    submitDt: new Date(submitDt),
  }
}

const accepted: WriteRepositoryReducer<
  IPendingQuoteAcceptedPayload,
  IQuoteEntity
> = ({ acceptDt }, state) => {
  return {
    ...state,
    acceptDt: new Date(acceptDt),
  }
}

const { QUOTE_RECEIVED, PENDING_QUOTE_ACCEPTED, QUOTE_SUBMITTED } =
  DomainEventNames
export const QUOTE_REDUCERS: WriteRepositoryReducerMap<IQuoteEntity> = {
  [QUOTE_RECEIVED]: received,
  [QUOTE_SUBMITTED]: submitted,
  [PENDING_QUOTE_ACCEPTED]: accepted,
}
