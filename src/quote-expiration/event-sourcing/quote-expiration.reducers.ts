import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import {
  TypeormReducer,
  TypeormReducerMap,
} from 'src/types/typeorm-reducers.types'
import { PerishableQuoteTypeormEntity } from '../db/perishable-quote.typeorm-entity'

const onSubmit: TypeormReducer<IQuoteSubmittedEventPayload> = async (
  { data },
  manager,
) => {
  const { quoteId, expireDt } = data
  await manager.insert(PerishableQuoteTypeormEntity, {
    expireDt,
    quoteId,
  })
  return true
}

const onPendingEnd: TypeormReducer<
  | IPendingQuoteAcceptedPayload
  | IPendingQuoteCancelledPayload
  | IPendingQuoteExpirationAcknowledgedEventPayload
> = async ({ data }, manager) => {
  const { quoteId } = data
  await manager.delete(PerishableQuoteTypeormEntity, {
    quoteId,
  })
  return true
}

const {
  QUOTE_SUBMITTED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
} = DomainEventNames

export const EXPIRATION_REDUCERS: TypeormReducerMap = {
  [QUOTE_SUBMITTED]: onSubmit,
  [PENDING_QUOTE_ACCEPTED]: onPendingEnd,
  [PENDING_QUOTE_CANCELLED]: onPendingEnd,
  [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: onPendingEnd,
}
