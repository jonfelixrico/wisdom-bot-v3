import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class PendingQuoteWriteRepository extends EsdbRepository<PendingQuote> {}
