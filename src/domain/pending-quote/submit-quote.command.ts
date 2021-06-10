import { ICommand } from '../command.interface'
import { IQuoteToSubmit } from './quote-to-submit.interface'

export class SubmitQuote implements ICommand<IQuoteToSubmit> {
  constructor(readonly payload: IQuoteToSubmit) {}
}
