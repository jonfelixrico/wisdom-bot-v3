import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IQuoteReceivedPayload } from 'src/domain/events/quote-received.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { ReadRepositoryReducer } from '../types/read-repository-reducer.type'
import { ReducerMap } from '../types/reducer-map.type'

export const quoteSubmitted: ReadRepositoryReducer<IQuoteSubmittedEventPayload> =
  async ({ revision, data }, manager) => {
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

export const pendingQuoteAccepted: ReadRepositoryReducer<IPendingQuoteAcceptedPayload> =
  async ({ revision, data }, manager) => {
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

export const pendingQuoteCancelled: ReadRepositoryReducer<IPendingQuoteCancelledPayload> =
  async ({ revision, data }, manager) => {
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

export const quoteReceived: ReadRepositoryReducer<IQuoteReceivedPayload> =
  async ({ revision, data }, manager) => {
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

const {
  QUOTE_SUBMITTED,
  QUOTE_RECEIVED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
} = DomainEventNames

export const QUOTE_REDUCERS: ReducerMap = Object.freeze({
  [QUOTE_RECEIVED]: quoteReceived,
  [QUOTE_SUBMITTED]: quoteSubmitted,
  [PENDING_QUOTE_ACCEPTED]: pendingQuoteAccepted,
  [PENDING_QUOTE_CANCELLED]: pendingQuoteCancelled,
})
