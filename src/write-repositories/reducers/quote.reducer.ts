import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteEntity } from 'src/domain/entities/quote.entity'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const submitted: WriteRepositoryReducer<
  IQuoteSubmittedEventPayload,
  IQuoteEntity
> = ({ submitDt, ...data }) => {
  return {
    ...data,
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

const { PENDING_QUOTE_ACCEPTED, QUOTE_SUBMITTED } = DomainEventNames
export const QUOTE_REDUCERS: WriteRepositoryReducerMap<IQuoteEntity> = {
  [QUOTE_SUBMITTED]: submitted,
  [PENDING_QUOTE_ACCEPTED]: accepted,
}
