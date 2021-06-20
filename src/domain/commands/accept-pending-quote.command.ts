import { ICommand } from '../command.interface'

export class AcceptPendingQuoteCommand implements ICommand<string> {
  constructor(readonly payload: string) {}
}
