import { IEvent } from '@nestjs/cqrs'

export abstract class ReadRepositoryMessage<
  PayloadType = any,
  EventType = string,
> implements IEvent
{
  abstract readonly streamId: string
  abstract readonly revision: bigint
  abstract readonly payload: PayloadType
  abstract readonly eventType: EventType
}
