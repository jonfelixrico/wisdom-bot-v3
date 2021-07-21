import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteReceivedPayload } from 'src/domain/events/quote-received.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { ReadRepositoryReducer } from '../types/read-repository-reducer.type'
import { ReducerMap } from '../types/reducer-map.type'

const submitted: ReadRepositoryReducer<IQuoteSubmittedEventPayload> = async (
  { revision, data },
  manager,
) => {
  const {
    authorId,
    channelId,
    content,
    expireDt,
    guildId,
    quoteId,
    messageId,
    submitterId,
    submitDt,
    upvoteCount,
    upvoteEmoji,
  } = data

  await manager.insert(QuoteTypeormEntity, {
    authorId,
    channelId,
    content,
    expireDt,
    guildId,
    id: quoteId,
    messageId,
    revision,
    submitterId,
    submitDt,
    upvoteCount,
    upvoteEmoji,
  })

  return true
}

const accepted: ReadRepositoryReducer<IPendingQuoteAcceptedPayload> = async (
  { revision, data },
  manager,
) => {
  const { acceptDt, quoteId } = data
  const { affected } = await manager
    .createQueryBuilder()
    .update(QuoteTypeormEntity)
    .set({
      acceptDt,
      revision,
    })
    .where('id = :quoteId AND revision = :revision', {
      quoteId,
      revision: revision - 1n,
    })
    .execute()

  return affected > 0
}

const cancelled: ReadRepositoryReducer<IPendingQuoteCancelledPayload> = async (
  { revision, data },
  manager,
) => {
  const { cancelDt, quoteId } = data
  const { affected } = await manager
    .createQueryBuilder()
    .update(QuoteTypeormEntity)
    .set({
      cancelDt,
      revision,
    })
    .where('id = :quoteId AND revision = :revision', {
      quoteId,
      revision: revision - 1n,
    })
    .execute()

  return affected > 0
}

const received: ReadRepositoryReducer<IQuoteReceivedPayload> = async (
  { revision, data },
  manager,
) => {
  const { quoteId } = data
  const { affected } = await manager
    .createQueryBuilder()
    .update(QuoteTypeormEntity)
    .set({
      revision,
    })
    .where('id = :quoteId AND revision = :revision', {
      quoteId,
      revision: revision - 1n,
    })
    .execute()

  return affected > 0
}

const messageDetailsUpdated: ReadRepositoryReducer<IQuoteMessageDetailsUpdatedPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId, messageId, channelId } = data

    const { affected } = await manager.update(
      QuoteTypeormEntity,
      {
        id: quoteId,
      },
      { messageId, revision, channelId },
    )

    return affected > 0
  }

const expirationAcknowledged: ReadRepositoryReducer<IPendingQuoteExpirationAcknowledgedEventPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId, expireAckDt } = data

    const { affected } = await manager.update(
      QuoteTypeormEntity,
      {
        id: quoteId,
      },
      { revision, expireAckDt },
    )

    return affected > 0
  }

const {
  QUOTE_SUBMITTED,
  QUOTE_RECEIVED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  QUOTE_MESSAGE_DETAILS_UPDATED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
} = DomainEventNames

export const QUOTE_REDUCERS: ReducerMap = Object.freeze({
  [QUOTE_RECEIVED]: received,
  [QUOTE_SUBMITTED]: submitted,
  [PENDING_QUOTE_ACCEPTED]: accepted,
  [PENDING_QUOTE_CANCELLED]: cancelled,
  [QUOTE_MESSAGE_DETAILS_UPDATED]: messageDetailsUpdated,
  [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: expirationAcknowledged,
})