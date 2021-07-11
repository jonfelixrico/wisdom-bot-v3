import { ICommand } from '../command.interface'
import { IQuoteToSubmit } from '../entities/quote-to-submit.interface'

export type ISubmitQuoteCommandPayload = IQuoteToSubmit

export class SubmitQuoteCommand
  implements ICommand<ISubmitQuoteCommandPayload>
{
  constructor(readonly payload: ISubmitQuoteCommandPayload) {}
}
