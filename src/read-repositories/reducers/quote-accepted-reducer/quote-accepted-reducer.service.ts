import { Injectable, Logger } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IPendingQuoteAcceptedPayload } from 'src/domain/events/pending-quote-accepted.event'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'
import { QuoteTypeormRepository } from 'src/typeorm/providers/quote.typeorm-repository'
import {
  BaseConcurrencyLimitedEventHandler,
  ReduceStatus,
} from '../base-concurrency-limited-event-handler.abstract'

@Injectable()
export class QuoteAcceptedReducerService extends BaseConcurrencyLimitedEventHandler<IPendingQuoteAcceptedPayload> {
  CONCURRENCY_LIMIT = 50
  CLASS_NAME = QuoteAcceptedReducerService.name

  constructor(
    private repo: QuoteTypeormRepository,
    eventBus: EventBus,
    protected logger: Logger,
  ) {
    super(eventBus, logger)
  }

  filter(e: ReadRepositoryEsdbEvent<IPendingQuoteAcceptedPayload>): boolean {
    return e.type === DomainEventNames.PENDING_QUOTE_ACCEPTED
  }

  async handle({
    revision,
    data,
  }: ReadRepositoryEsdbEvent<IPendingQuoteAcceptedPayload>): Promise<ReduceStatus> {
    const { acceptDt, quoteId } = data
    const quoteEntity = await this.repo.findOne({ id: quoteId })

    if (quoteEntity.esdb.revision - revision !== BigInt(1)) {
      return ReduceStatus.SKIPPED
    }

    quoteEntity.esdb.revision = revision
    quoteEntity.acceptDt = acceptDt

    await this.repo.save(quoteEntity)
  }
}
