import { EsdbRepository } from './esdb-repository.abstract'
import { PendingQuote } from 'src/domain/pending-quote/pending-quote.entity'

export abstract class PendingQuoteEsdbRepository extends EsdbRepository<PendingQuote> {}
