import { ICommand } from '../command.interface'

export class CancelPendingQuoteCommand implements ICommand<string> {
  constructor(readonly payload: string) {}
}
