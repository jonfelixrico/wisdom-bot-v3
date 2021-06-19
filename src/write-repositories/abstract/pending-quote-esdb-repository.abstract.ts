import { EsdbRepository } from './esdb-repository.abstract'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'
import { BasePendingQuoteEvent } from 'src/domain/pending-quote/events/base-pending-quote-event.abstract'

export abstract class PendingQuoteEsdbRepository extends EsdbRepository<
  PendingQuote,
  BasePendingQuoteEvent
> {}
