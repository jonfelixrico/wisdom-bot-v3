import { IQuoteToSubmit } from './quote-to-submit.interface'

export interface IPendingQuote extends IQuoteToSubmit {
  quoteId: string

  // Optional because these are nullable.
  acceptDt?: Date
  cancelDt?: Date
  expireAckDt?: Date

  submitDt: Date
}
