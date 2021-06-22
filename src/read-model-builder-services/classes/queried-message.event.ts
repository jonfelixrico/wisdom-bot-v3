import { ReadModelBuildMessage } from './read-model-build-message.event'

export class QueriedMessage<
  PayloadType = any,
  EventType = string,
> extends ReadModelBuildMessage<PayloadType, EventType> {
  constructor(
    readonly streamId: string,
    readonly revision: bigint,
    readonly eventType: EventType,
    readonly payload: PayloadType,
  ) {
    super()
  }
}
