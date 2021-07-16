import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuote } from 'src/domain/entities/pending-quote.interface'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IQuoteMessageIdUpdatedPayload } from 'src/domain/events/quote-message-id-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  WriteRepositoryReducer,
  WriteRepositoryReducerMap,
} from './write-repository-reducer.type'

const quoteSubmitted: WriteRepositoryReducer<
  IQuoteSubmittedEventPayload,
  IPendingQuote
> = (data, state) => ({
  ...data,
  acceptDt: null,
  cancelDt: null,
})

const quoteCancelled: WriteRepositoryReducer<
  IPendingQuoteCancelledPayload,
  IPendingQuote
> = ({ cancelDt }, state) => {
  state.cancelDt = cancelDt
  return state
}

const quoteAccepted: WriteRepositoryReducer<
  IPendingQuoteAcceptedPayload,
  IPendingQuote
> = ({ acceptDt }, state) => {
  state.acceptDt = acceptDt
  return state
}

const messageIdUpdated: WriteRepositoryReducer<
  IQuoteMessageIdUpdatedPayload,
  IPendingQuote
> = ({ messageId }: IQuoteMessageIdUpdatedPayload, state: IPendingQuote) => {
  state.messageId = messageId
  return state
}

const {
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  QUOTE_SUBMITTED,
  QUOTE_MESSAGE_ID_UPDATED,
} = DomainEventNames
export const PENDING_QUOTE_REDUCERS: WriteRepositoryReducerMap<IPendingQuote> =
  {
    [PENDING_QUOTE_ACCEPTED]: quoteAccepted,
    [PENDING_QUOTE_CANCELLED]: quoteCancelled,
    [QUOTE_SUBMITTED]: quoteSubmitted,
    [QUOTE_MESSAGE_ID_UPDATED]: messageIdUpdated,
  }
