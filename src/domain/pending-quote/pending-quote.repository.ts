import { Repository } from '../repository.abstract'
import { PendingQuote } from './pending-quote.entity'
import { IQuoteToSubmit } from 'src/domain/pending-quote/quote-to-submit.interface'

export abstract class PendingQuoteRepository extends Repository<PendingQuote> {
  abstract create(quoteToSubmit: IQuoteToSubmit): Promise<PendingQuote>
}
