import { Injectable, Logger } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import {
  BaseConcurrencyLimitedEventHandler,
  ReduceStatus,
} from '../base-concurrency-limited-event-handler.abstract'

@Injectable()
export class QuoteSubmittedReducerService extends BaseConcurrencyLimitedEventHandler<IQuoteSubmittedEventPayload> {
  CONCURRENCY_LIMIT = 25
  CLASS_NAME = QuoteSubmittedReducerService.name

  filter(e: ReadRepositoryEsdbEvent<IQuoteSubmittedEventPayload>): boolean {
    return (
      e instanceof ReadRepositoryEsdbEvent &&
      e.type === DomainEventNames.QUOTE_SUBMITTED
    )
  }

  constructor(
    protected logger: Logger,
    private repo: QuoteTypeormRepository,
    protected eventBus: EventBus,
  ) {
    super(eventBus, logger)
  }

  async handle({
    data,
    revision,
  }: ReadRepositoryEsdbEvent<IQuoteSubmittedEventPayload>) {
    const { quoteId } = data

    const quote = await this.repo.findOne({
      id: quoteId,
    })

    if (quote) {
      // TODO add logging here
      return ReduceStatus.SKIPPED
    }

    const {
      authorId,
      channelId,
      content,
      expireDt,
      guildId,
      messageId,
      submitterId,
      upvoteCount,
      upvoteEmoji,
      submitDt,
    } = data

    await this.repo.save({
      id: quoteId,
      authorId,
      channelId,
      content,
      expireDt,
      esdb: { revision },
      guildId,
      messageId,
      submitterId,
      upvoteCount,
      upvoteEmoji,
      submitDt,
    })

    return ReduceStatus.CONSUMED
  }
}
