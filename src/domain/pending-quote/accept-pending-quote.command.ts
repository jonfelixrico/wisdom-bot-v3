import { ICommand } from '../command.interface'

export class AcceptPendingQuote implements ICommand<string> {
  constructor(readonly payload: string) {}
}
