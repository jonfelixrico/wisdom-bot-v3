import {
  END,
  EventStoreDBClient,
  ReadRevision,
  RecordedEvent,
} from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Subject } from 'rxjs'

@Injectable()
export class EventRelayService implements OnModuleInit {
  private stream$ = new Subject<RecordedEvent>()

  constructor(private client: EventStoreDBClient, private logger: Logger) {}

  private emitEvent(event: RecordedEvent, isLive: boolean) {
    const { revision, streamId } = event
    this.logger.debug(
      `Emitted revision ${revision} of stream ${streamId}; source: ${
        isLive ? 'live' : 'presisted'
      }`,
      EventRelayService.name,
    )

    this.stream$.next(event)
  }

  /**
   * Tries to retrieve the event from the stream. If found, then that event is returned
   * and additionally, emitted to this EvnetRelayService's event stream.
   *
   * @param streamName
   * @param fromRevision
   * @returns Null if no event matches the query, the actual RecordedEvent instance if otherwise.
   */
  async queryEvent(
    streamName: string,
    fromRevision: ReadRevision,
  ): Promise<RecordedEvent> {
    const [resolvedEvent] = await this.client.readStream(streamName, {
      fromRevision,
      maxCount: 1,
    })

    if (!resolvedEvent) {
      this.logger.debug(
        `Found no events at position ${fromRevision} on stream ${streamName}.`,
        EventRelayService.name,
      )
      return null
    }

    this.emitEvent(resolvedEvent.event, false)
    return resolvedEvent.event
  }

  onModuleInit() {
    this.client
      .subscribeToAll({ fromPosition: END })
      .on('data', ({ event }) => {
        const { isJson, type, streamId } = event

        if (
          // For events in the read model, we only expect JSON types
          !isJson ||
          // If an event type starts with '$', it's a system event
          type.startsWith('$') ||
          // Additionally, if a stream starts with '$', it's a projection. We're only listening for actual streams here.
          streamId.startsWith('$')
        ) {
          return
        }

        this.emitEvent(event, true)
      })
  }
}
