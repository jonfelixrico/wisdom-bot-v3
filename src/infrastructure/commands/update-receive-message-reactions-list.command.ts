import { ICommand } from '@nestjs/cqrs'

export interface IUpdateReceiveMessageReactionsListCommand {
  receiveId: string
  reactions: {
    // the strings here are user ids/snowflakes
    upvotes: string[]
    downvotes: string[]
  }
}

export class UpdateReceiveMessageReactionsListCommand implements ICommand {
  constructor(readonly payload: IUpdateReceiveMessageReactionsListCommand) {}
}
