import { ICommand } from '@nestjs/cqrs'

export interface ISuspendDeleteWatchCommandPayload {
  messageId: string
}

export class SuspendDeleteWatchCommand implements ICommand {
  constructor(readonly payload: ISuspendDeleteWatchCommandPayload) {}
}
