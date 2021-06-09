import { IQuoteToSubmit } from './quote-to-submit.interface'

export class QuoteSubmitted {
  constructor(readonly created: IQuoteToSubmit) {}
}
