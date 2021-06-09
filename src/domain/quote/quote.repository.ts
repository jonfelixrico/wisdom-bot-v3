import { Repository } from '../repository.abstract'
import { Quote } from './quote.entity'

export abstract class QuoteRepostiory extends Repository<Quote> {}
