import { Quote } from 'src/domain/entities/quote.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class QuoteWriteRepository extends EsdbRepository<Quote> {}
