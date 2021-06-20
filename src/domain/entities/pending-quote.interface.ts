import { IQuoteToSubmit } from './quote-to-submit.interface'

export interface IPendingQuote extends IQuoteToSubmit {
  quoteId: string

  acceptDt: Date
  cancelDt: Date
}
