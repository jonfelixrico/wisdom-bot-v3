import { ICommand } from '@nestjs/cqrs'

export interface ISuspendDeleteWatchCommandPayload {
  messageId: string
  removeSuspension?: boolean
}

export class SuspendDeleteWatchCommand implements ICommand {
  constructor(readonly payload: ISuspendDeleteWatchCommandPayload) {}
}
