import { Repository } from '../repository.abstract'
import { PendingQuote } from './pending-quote.entity'

export abstract class PendingQuoteRepository extends Repository<PendingQuote> {}
