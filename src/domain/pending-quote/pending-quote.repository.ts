import { Repository } from '../repository.abstract'
import { PendingQuote } from './pending-quote.entity'
import { IQuoteToSubmit } from './quote-to-submit.interface'

export abstract class PendingQuoteRepository extends Repository<PendingQuote> {
  abstract create(quote: IQuoteToSubmit): Promise<PendingQuote>
}
