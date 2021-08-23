import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IPendingQuoteVoteCastedEventPayload } from 'src/domain/events/pending-quote-vote-casted.event'
import { IPendingQuoteVoteWithdrawnEventPayload } from 'src/domain/events/pending-quote-vote-withdrawn.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { QuoteVoteTypeormEntity } from 'src/typeorm/entities/quote-vote.typeorm-entity'
import { QuoteTypeormEntity } from 'src/typeorm/entities/quote.typeorm-entity'
import {
  TypeormReducerMap,
  TypeormReducer,
} from '../../types/typeorm-reducers.types'

const submitted: TypeormReducer<IQuoteSubmittedEventPayload> = async (
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

const accepted: TypeormReducer<IPendingQuoteAcceptedPayload> = async (
  { revision, data },
  manager,
) => {
  const { acceptDt, quoteId } = data

  const repo = manager.getRepository(QuoteTypeormEntity)
  const quote = await repo.findOne({ where: { id: quoteId } })

  if (!quote || quote.revision !== revision - 1n) {
    return false
  }

  await repo.update({ id: quoteId }, { revision, acceptDt })

  return true
}

const cancelled: TypeormReducer<IPendingQuoteCancelledPayload> = async (
  { revision, data },
  manager,
) => {
  const { cancelDt, quoteId } = data

  const repo = manager.getRepository(QuoteTypeormEntity)
  const quote = await repo.findOne({ where: { id: quoteId } })

  if (!quote || quote.revision !== revision - 1n) {
    return false
  }

  await repo.update({ id: quoteId }, { revision, cancelDt })

  return true
}

const messageDetailsUpdated: TypeormReducer<IQuoteMessageDetailsUpdatedPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId, channelId: newChannelId, ...others } = data

    const repo = manager.getRepository(QuoteTypeormEntity)
    const quote = await repo.findOne({ where: { id: quoteId } })

    if (!quote || quote.revision !== revision - 1n) {
      return false
    }

    await repo.update(
      { id: quoteId },
      { revision, channelId: newChannelId, ...others },
    )

    return true
  }

const expirationAcknowledged: TypeormReducer<IPendingQuoteExpirationAcknowledgedEventPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId, expireAckDt } = data

    const repo = manager.getRepository(QuoteTypeormEntity)
    const quote = await repo.findOne({ where: { id: quoteId } })

    if (!quote || quote.revision !== revision - 1n) {
      return false
    }

    await repo.update({ id: quoteId }, { revision, expireAckDt })

    return true
  }

const voteCasted: TypeormReducer<IPendingQuoteVoteCastedEventPayload> = async (
  { revision, data },
  manager,
) => {
  const { quoteId, userId, voteValue } = data
  const { affected } = await manager.update(
    QuoteTypeormEntity,
    {
      id: quoteId,
      revision: revision - 1n,
    },
    { revision },
  )

  if (!affected) {
    return false
  }

  await manager.insert(QuoteVoteTypeormEntity, {
    id: `${quoteId}/${userId}`,
    quoteId,
    userId,
    value: voteValue,
  })

  return true
}

const voteWithdrawn: TypeormReducer<IPendingQuoteVoteWithdrawnEventPayload> =
  async ({ revision, data }, manager) => {
    const { quoteId, userId } = data

    const { affected: updated } = await manager.update(
      QuoteTypeormEntity,
      {
        id: quoteId,
        revision: revision - 1n,
      },
      { revision },
    )

    if (!updated) {
      return false
    }

    const { affected: deleted } = await manager.delete(QuoteVoteTypeormEntity, {
      id: `${quoteId}/${userId}`,
    })

    return !!deleted
  }

const {
  QUOTE_SUBMITTED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  QUOTE_MESSAGE_DETAILS_UPDATED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
  PENDING_QUOTE_VOTE_CASTED,
  PENDING_QUOTE_VOTE_WITHDRAWN,
} = DomainEventNames

export const QUOTE_REDUCERS: TypeormReducerMap = Object.freeze({
  [QUOTE_SUBMITTED]: submitted,
  [PENDING_QUOTE_ACCEPTED]: accepted,
  [PENDING_QUOTE_CANCELLED]: cancelled,
  [QUOTE_MESSAGE_DETAILS_UPDATED]: messageDetailsUpdated,
  [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: expirationAcknowledged,
  [PENDING_QUOTE_VOTE_WITHDRAWN]: voteWithdrawn,
  [PENDING_QUOTE_VOTE_CASTED]: voteCasted,
})
