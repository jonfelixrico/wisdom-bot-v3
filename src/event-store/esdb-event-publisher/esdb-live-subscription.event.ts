import { AllStreamRecordedEvent, JSONType } from '@eventstore/db-client'
import { IEvent } from '@nestjs/cqrs'

export class EsdbLiveSubscriptionEvent implements IEvent {
  readonly streamId: string
  readonly data: JSONType
  readonly revision: bigint
  readonly type: string

  constructor(esdbEvent: AllStreamRecordedEvent) {
    const { streamId, type, data, revision } = esdbEvent
    this.data = data as JSONType
    this.revision = revision
    this.type = type
    this.streamId = streamId
  }
}
