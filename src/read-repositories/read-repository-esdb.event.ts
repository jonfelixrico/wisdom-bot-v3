import { JSONType } from '@eventstore/db-client'

interface IStreamEvent<DataType = JSONType> {
  readonly data: DataType
  readonly revision: bigint
  readonly type: string
}

export class ReadRepositoryEsdbEvent {
  constructor(
    readonly streamId: string,
    readonly events: IStreamEvent<unknown>[],
    readonly source: 'LIVE' | 'CATCH_UP',
  ) {}
}
