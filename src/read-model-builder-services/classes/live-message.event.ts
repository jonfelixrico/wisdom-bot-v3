import { ReadModelBuildMessage as LiveMessage } from './read-model-build-message.event'

export class QueriedMessage<
  PayloadType = any,
  EventType = string,
> extends LiveMessage<PayloadType, EventType> {
  constructor(
    readonly streamId: string,
    readonly revision: bigint,
    readonly eventType: EventType,
    readonly payload: PayloadType,
  ) {
    super()
  }
}
