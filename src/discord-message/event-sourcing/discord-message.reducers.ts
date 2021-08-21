import { Multi } from 'redis'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { IPendingQuoteCancelledPayload } from 'src/domain/events/pending-quote-cancelled.event'
import { IPendingQuoteExpirationAcknowledgedEventPayload } from 'src/domain/events/pending-quote-expiration-acknowledged.event'
import { IQuoteMessageDetailsUpdatedPayload } from 'src/domain/events/quote-message-details-updated.event'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { Repository } from 'typeorm'
import { QuoteMessageTypeormEntity } from '../db/quote-message.typeorm-entity'

export type DiscordMessageReducer<DataType = unknown> = (
  data: DataType,
  repo: Repository<QuoteMessageTypeormEntity>,
  multi: Multi,
) => Promise<boolean>

const onSubmit: DiscordMessageReducer<IQuoteSubmittedEventPayload> = async (
  { quoteId, messageId, channelId, guildId },
  repo,
  multi,
) => {
  await repo.insert({
    quoteId,
    guildId,
    messageId,
    channelId,
  })

  multi.set(messageId, quoteId)

  return true
}

const onUpdate: DiscordMessageReducer<IQuoteMessageDetailsUpdatedPayload> =
  async ({ quoteId, messageId, channelId }, repo, multi) => {
    const quote = await repo.findOne({ where: { quoteId } })

    if (!quote) {
      return false
    }

    await repo.update({ quoteId }, { messageId, channelId })

    if (quote.messageId && quote.channelId) {
      multi.del(quote.messageId)
    }

    multi.set(messageId, quoteId)

    return true
  }

const onPendingEnd: DiscordMessageReducer<
  | IPendingQuoteAcceptedPayload
  | IPendingQuoteCancelledPayload
  | IPendingQuoteExpirationAcknowledgedEventPayload
> = async ({ quoteId }, repo, multi) => {
  const quote = await repo.findOne({ where: { quoteId } })

  if (!quote) {
    return false
  }

  await repo.delete({ quoteId })
  multi.del(quote.messageId)

  return true
}

type DiscordMessageReducerMap = {
  [key: string]: DiscordMessageReducer
}

const {
  QUOTE_SUBMITTED,
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
  QUOTE_MESSAGE_DETAILS_UPDATED,
} = DomainEventNames

export const MESSAGE_REDUCERS: DiscordMessageReducerMap = {
  [QUOTE_SUBMITTED]: onSubmit,
  [QUOTE_MESSAGE_DETAILS_UPDATED]: onUpdate,
  [PENDING_QUOTE_ACCEPTED]: onPendingEnd,
  [PENDING_QUOTE_CANCELLED]: onPendingEnd,
  [PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED]: onPendingEnd,
}
