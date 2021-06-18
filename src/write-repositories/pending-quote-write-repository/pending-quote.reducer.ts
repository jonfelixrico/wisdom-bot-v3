import { ResolvedEvent } from '@eventstore/db-client'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteCancelledPayload } from 'src/domain/pending-quote/pending-quote-cancelled.event'
import { IPendingQuote } from 'src/domain/pending-quote/pending-quote.interface'
import { PrematureReturnFn } from 'src/event-store/read-stream/read-stream.service'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function quoteSubmitted(state: IPendingQuote, data: IPendingQuote) {
  return data
}

function quoteCancelled(
  state: IPendingQuote,
  { cancelDt }: IPendingQuoteCancelledPayload,
) {
  state.cancelDt = cancelDt
  return state
}

const { PENDING_QUOTE_ACCEPTED, PENDING_QUOTE_CANCELLED, QUOTE_SUBMITTED } =
  DomainEventNames

const ReducerMapping = {
  [PENDING_QUOTE_CANCELLED]: quoteCancelled,
  [QUOTE_SUBMITTED]: quoteSubmitted,
}

export function pendingQuoteReducer(
  state: IPendingQuote,
  { event }: ResolvedEvent,
  prematureReturn: PrematureReturnFn<IPendingQuote>,
) {
  const { type, data } = event
  if (type === PENDING_QUOTE_ACCEPTED) {
    prematureReturn(null)
    return
  }

  return ReducerMapping[type](state, data)
}
