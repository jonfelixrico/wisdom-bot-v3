import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from 'src/domain/entities/pending-quote.interface'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const quoteSubmitted: WriteRepositoryReducer<
  IQuoteSubmittedEventPayload,
  IPendingQuote
> = ({ submitDt, ...data }) => ({
  ...data,
  acceptDt: null,
  cancelDt: null,
  submitDt: new Date(submitDt),
})

const quoteCancelled: WriteRepositoryReducer<
  IPendingQuoteCancelledPayload,
  IPendingQuote
> = ({ cancelDt }, state) => {
  return {
    ...state,
    cancelDt: new Date(cancelDt),
  }
}

const quoteAccepted: WriteRepositoryReducer<
  IPendingQuoteAcceptedPayload,
  IPendingQuote
> = ({ acceptDt }, state) => {
  return {
    ...state,
    acceptDt: new Date(acceptDt),
  }
}

const messageIdUpdated: WriteRepositoryReducer<
  IQuoteMessageDetailsUpdatedPayload,
  IPendingQuote
> = (
  { messageId }: IQuoteMessageDetailsUpdatedPayload,
  state: IPendingQuote,
) => {
  return {
    ...state,
    messageId,
  }
}

const {
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  QUOTE_SUBMITTED,
  QUOTE_MESSAGE_DETAILS_UPDATED: QUOTE_MESSAGE_ID_UPDATED,
} = DomainEventNames
export const PENDING_QUOTE_REDUCERS: WriteRepositoryReducerMap<IPendingQuote> =
  {
    [PENDING_QUOTE_ACCEPTED]: quoteAccepted,
    [PENDING_QUOTE_CANCELLED]: quoteCancelled,
    [QUOTE_SUBMITTED]: quoteSubmitted,
    [QUOTE_MESSAGE_ID_UPDATED]: messageIdUpdated,
  }
