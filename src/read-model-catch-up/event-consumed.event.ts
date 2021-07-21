import { IEvent } from '@nestjs/cqrs'

export class EventConsumedEvent implements IEvent {
  constructor(readonly streamName: string, readonly revision: bigint) {}
}
