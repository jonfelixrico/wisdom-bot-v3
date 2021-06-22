import { ReadRepositoryMessage } from './read-repository-message.event'

export class QueriedMessage<
  PayloadType = any,
  EventType = string,
> extends ReadRepositoryMessage<PayloadType, EventType> {
  constructor(
    readonly streamId: string,
    readonly revision: bigint,
    readonly eventType: EventType,
    readonly payload: PayloadType,
  ) {
    super()
  }
}
