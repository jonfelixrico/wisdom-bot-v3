import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IQuoteReceivedPayload } from 'src/domain/events/quote-received.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import { EsdbEventReducer } from '../types/esdb-event-reducer.type'

export const quoteSubmitted: EsdbEventReducer<IQuoteSubmittedEventPayload> =
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

export const pendingQuoteAccepted: EsdbEventReducer<IPendingQuoteAcceptedPayload> =
  async ({ revision, data }, manager) => {
    const { acceptDt, quoteId } = data
    await manager
      .createQueryBuilder()
      .update(QuoteTypeormEntity)
      .set({
        acceptDt,
        revision,
      })
      .where('id = :quoteId', { quoteId })
      .execute()
  }

export const pendingQuoteCancelled: EsdbEventReducer<IPendingQuoteCancelledPayload> =
  async ({ revision, data }, manager) => {
    const { cancelDt, quoteId } = data
    await manager
      .createQueryBuilder()
      .update(QuoteTypeormEntity)
      .set({
        cancelDt,
        revision,
      })
      .where('id = :quoteId', { quoteId })
      .execute()
  }

export const quoteReceived: EsdbEventReducer<IQuoteReceivedPayload> = async (
  { revision, data },
  manager,
) => {
  const { quoteId } = data
  await manager
    .createQueryBuilder()
    .update(QuoteTypeormEntity)
    .set({
      revision,
    })
    .where('id = :quoteId', { quoteId })
    .execute()
}
