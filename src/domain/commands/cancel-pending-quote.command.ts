import { ICommand } from '../command.interface'

export class CancelPendingQuote implements ICommand<string> {
  constructor(readonly payload: string) {}
}
