import { IQuoteToSubmit } from './quote-to-submit.interface'

export class SubmitQuote {
  constructor(readonly quote: IQuoteToSubmit) {}
}
