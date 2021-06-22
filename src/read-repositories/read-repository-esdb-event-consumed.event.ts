import { ReadRevision } from '@eventstore/db-client'
import { IEvent } from '@nestjs/cqrs'

export class ReadRepositoryEsdbEventConsumedEvent implements IEvent {
  constructor(
    readonly streamName: string,
    readonly fromRevision: ReadRevision,
  ) {}
}
