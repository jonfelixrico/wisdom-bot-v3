import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IQuoteReceivedPayload } from 'src/domain/events/quote-received.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { ReadRepositoryReducer } from '../types/read-repository-reducer.type'

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

    manager.insert(QuoteTypeormEntity, {
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
  }

export const pendingQuoteAccepted: ReadRepositoryReducer<IPendingQuoteAcceptedPayload> =
  async ({ revision, data }, manager) => {
    const { acceptDt, quoteId } = data
    await manager
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
  }

export const pendingQuoteCancelled: ReadRepositoryReducer<IPendingQuoteCancelledPayload> =
  async ({ revision, data }, manager) => {
    const { cancelDt, quoteId } = data
    await manager
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
  }

export const quoteReceived: ReadRepositoryReducer<IQuoteReceivedPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId } = data
    await manager
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
  }
