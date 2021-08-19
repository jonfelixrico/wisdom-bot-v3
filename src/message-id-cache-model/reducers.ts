import {
  AllStreamJSONRecordedEvent,
  JSONEventType,
  JSONType,
  Position,
} from '@eventstore/db-client'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { promisify } from 'util'
import { WrappedRedisClient } from './utils/wrapped-redis-client.class'

export type CacheReducer<EventDataType extends JSONType = JSONType> = (
  // This is directly taken from EventStoreDB
  event: AllStreamJSONRecordedEvent<JSONEventType<string, EventDataType>>,
  client: WrappedRedisClient,
) => Promise<void> // true if processed, false if skipped

type CacheReducerMap = {
  [key: string]: CacheReducer
}

const POSITION = 'POSITION'

export function serializePosition({ commit, prepare }: Position) {
  return [commit, prepare].join('/')
}

const onSubmit: CacheReducer<IQuoteSubmittedEventPayload> = async (
  { position, data },
  { client },
) => {
  const { messageId, quoteId } = data

  const chain = client
    .multi()
    .set(quoteId, messageId || '')
    .set(POSITION, serializePosition(position))

  if (messageId) {
    chain.set(messageId, quoteId)
  }

  await promisify(chain.exec).call(chain)
}

const onUpdate: CacheReducer<IQuoteMessageDetailsUpdatedPayload> = async (
  { position, data },
  wrapped,
) => {
  const { messageId, quoteId } = data

  const oldMessageId = await wrapped.get(quoteId)

  const chain = wrapped.client
    .multi()
    .set(quoteId, messageId || '')
    .set(POSITION, serializePosition(position))

  if (messageId) {
    chain.set(messageId, quoteId)
  }

  if (oldMessageId) {
    chain.del(oldMessageId)
  }

  await promisify(chain.exec).call(chain)
}

const onPendingEnd: CacheReducer<
  | IPendingQuoteExpirationAcknowledgedEventPayload
  | IPendingQuoteAcceptedPayload
  | IPendingQuoteCancelledPayload
> = async ({ position, data }, wrapped) => {
  const { quoteId } = data

  const messageId = await wrapped.get(quoteId)

  const chain = wrapped.client
    .multi()
    .del(quoteId)
    .set(POSITION, serializePosition(position))

  if (messageId) {
    chain.del(messageId)
  }

  await promisify(chain.exec).call(chain)
}

const {
  QUOTE_SUBMITTED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_ACCEPTED,
  QUOTE_MESSAGE_DETAILS_UPDATED,
} = DomainEventNames

export const CACHE_REDUCERS: CacheReducerMap = {
  [QUOTE_SUBMITTED]: onSubmit,
  [QUOTE_MESSAGE_DETAILS_UPDATED]: onUpdate,
  [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: onPendingEnd,
  [PENDING_QUOTE_CANCELLED]: onPendingEnd,
  [PENDING_QUOTE_ACCEPTED]: onPendingEnd,
}
