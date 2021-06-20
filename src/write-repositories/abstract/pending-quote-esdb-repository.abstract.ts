import { EsdbRepository } from './esdb-repository.abstract'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { BasePendingQuoteEvent } from 'src/domain/events/base-pending-quote-event.abstract'

export abstract class PendingQuoteEsdbRepository extends EsdbRepository<
  PendingQuote,
  BasePendingQuoteEvent
> {}
