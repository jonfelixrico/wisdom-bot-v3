import { ICommand } from '../command.interface'
import { IQuoteToSubmit } from '../entities/quote-to-submit.interface'

export class SubmitQuoteCommand implements ICommand<IQuoteToSubmit> {
  constructor(readonly payload: IQuoteToSubmit) {}
}
