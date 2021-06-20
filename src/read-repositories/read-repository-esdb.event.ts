import { JSONType } from '@eventstore/db-client'

interface IStreamEvent<DataType = JSONType> {
  readonly data: DataType
  readonly revision: bigint
  readonly type: string
}

/**
 * This class represents a series of events from a specific stream.
 * This is meant to be the only events read models should listen to when building
 * their data.
 */
export class ReadRepositoryEsdbEvent {
  /**
   * @param streamId The id of the stream the `events` are from.
   * @param events Contains event data, revision, and type. They are expected to be in-sequence.
   * @param source `LIVE` if this event was relayed from a live event, `CATCH_UP` if this was a
   *   response for a catch-up query.
   */
  constructor(
    readonly streamId: string,
    readonly events: IStreamEvent<unknown>[],
    readonly source: 'LIVE' | 'CATCH_UP',
  ) {}
}
