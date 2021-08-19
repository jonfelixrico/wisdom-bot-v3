import { IQuery } from '@nestjs/cqrs'

export interface IWatchedMessageQueryOutput {
  messageId: string
  quoteId: string
}

export interface IWatchedMessageInput {
  messageId: string
}

export class WatchedMessageQuery implements IQuery {
  constructor(readonly input: IWatchedMessageInput) {}
}
