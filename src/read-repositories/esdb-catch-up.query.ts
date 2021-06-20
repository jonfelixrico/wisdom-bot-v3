import { ReadRevision } from '@eventstore/db-client'
import { IQuery } from '@nestjs/cqrs'

export class EsdbCatchUpQuery implements IQuery {
  constructor(
    readonly streamName: string,
    readonly fromRevision: ReadRevision,
  ) {}
}
