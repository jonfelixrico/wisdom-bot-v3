import { ICommand } from '../command.interface'

interface IReceiveInfo {
  readonly quoteId: string
  readonly messageId: string
  readonly channelId: string
  readonly userId: string
}

export class ReceiveQuoteCommand implements ICommand<IReceiveInfo> {
  constructor(readonly payload: IReceiveInfo) {}
}
