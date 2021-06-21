import { Injectable, Logger } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { IQuoteSubmittedEventPayload } from 'src/domain/events/quote-submitted.event'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { BaseConcurrencyLimitedEventHandler } from '../base-reducer-service.abstract'

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
    logger: Logger,
    private repo: QuoteTypeormRepository,
    eventBus: EventBus,
  ) {
    super(eventBus, logger)
  }

  async handle({
    type,
    data,
    revision,
    streamId,
  }: ReadRepositoryEsdbEvent<IQuoteSubmittedEventPayload>) {
    const { quoteId } = data

    const quote = await this.repo.findOne({
      id: quoteId,
    })

    if (quote) {
      this.logger.debug(
        `Skipped event ${revision} (${type}) of stream ${streamId}; reason: already saved`,
        QuoteSubmittedReducerService.name,
      )
      // TODO add logging here
      return
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
    })

    // TODO make this message better, more descriptive
    this.logger.verbose(
      `Processed event ${revision} (${type}) of stream ${streamId}`,
      QuoteSubmittedReducerService.name,
    )
  }
}
