import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from 'src/domain/entities/pending-quote.entity'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const submitted: WriteRepositoryReducer<
  IQuoteSubmittedEventPayload,
  IPendingQuote
> = ({ submitDt, expireDt, ...data }) => ({
  ...data,
  acceptDt: null,
  cancelDt: null,
  submitDt: new Date(submitDt),
  expireDt: new Date(expireDt),
})

const cancelled: WriteRepositoryReducer<
  IPendingQuoteCancelledPayload,
  IPendingQuote
> = ({ cancelDt }, state) => {
  return {
    ...state,
    cancelDt: new Date(cancelDt),
  }
}

const accepted: WriteRepositoryReducer<
  IPendingQuoteAcceptedPayload,
  IPendingQuote
> = ({ acceptDt }, state) => {
  return {
    ...state,
    acceptDt: new Date(acceptDt),
  }
}

const messageDetailsUpdated: WriteRepositoryReducer<
  IQuoteMessageDetailsUpdatedPayload,
  IPendingQuote
> = (payload: IQuoteMessageDetailsUpdatedPayload, state: IPendingQuote) => {
  return {
    ...state,
    ...payload,
  }
}

const expirationAcknowledged: WriteRepositoryReducer<
  IPendingQuoteExpirationAcknowledgedEventPayload,
  IPendingQuote
> = ({ expireAckDt }, state) => {
  return {
    ...state,
    expireAckDt: new Date(expireAckDt),
  }
}

const {
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  QUOTE_SUBMITTED,
  QUOTE_MESSAGE_DETAILS_UPDATED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
} = DomainEventNames
export const PENDING_QUOTE_REDUCERS: WriteRepositoryReducerMap<IPendingQuote> =
  {
    [PENDING_QUOTE_ACCEPTED]: accepted,
    [PENDING_QUOTE_CANCELLED]: cancelled,
    [QUOTE_SUBMITTED]: submitted,
    [QUOTE_MESSAGE_DETAILS_UPDATED]: messageDetailsUpdated,
    [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: expirationAcknowledged,
  }
