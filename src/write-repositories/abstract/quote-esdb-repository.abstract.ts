import { Quote } from 'src/domain/quote/quote.entity'
import { EsdbRepository } from './esdb-repository.abstract'

export abstract class QuoteEsdbRepository extends EsdbRepository<Quote> {}
