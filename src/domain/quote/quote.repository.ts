import { Repository } from '../repository.abstract'
import { Quote } from './quote.entity'

export abstract class QuoteRepository extends Repository<Quote> {}
