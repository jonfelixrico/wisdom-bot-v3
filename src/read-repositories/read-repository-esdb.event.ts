import { IEvent } from '@nestjs/cqrs'

/**
 * This class represents a series of events from a specific stream.
 * This is meant to be the only events read models should listen to when building
 * their data.
 */
export class ReadRepositoryEsdbEvent<DataType = any> implements IEvent {
  readonly isLive: boolean

  /**
   * @param streamId The id of the stream the `events` are from.
   * @param events Contains event data, revision, and type. They are expected to be in-sequence.
   * @param source `LIVE` if this event was relayed from a live event, `CATCH_UP` if this was a
   *   response for a catch-up query.
   */
  constructor(
    readonly streamId: string,
    readonly revision: bigint,
    readonly type: string,
    readonly data: DataType,
    isLive?: boolean,
  ) {
    this.isLive = !!isLive
  }
}
