import {
  ErrorType,
  EventStoreDBClient,
  ReadRevision,
  START,
} from '@eventstore/db-client'
import { Logger, OnApplicationBootstrap } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { StreamsProjectionMessage } from '../classes/streams-projection-message.event'

const STREAMS_PROJECTION = '$streams'
const BATCH_SIZE = 100

@Injectable()
export class StreamsProjectionService implements OnApplicationBootstrap {
  constructor(
    private client: EventStoreDBClient,
    private logger: Logger,
    private eventBus: EventBus,
  ) {}

  async onApplicationBootstrap() {
    let fromRevision: ReadRevision = START

    try {
      while (true) {
        const resolvedEvents = await this.client.readStream(
          STREAMS_PROJECTION,
          {
            fromRevision,
            maxCount: BATCH_SIZE,
            // this is critical or else we'll get gibberish events
            resolveLinkTos: true,
          },
        )

        for (const { event } of resolvedEvents) {
          const { type, data, streamId, revision } = event
          fromRevision = revision

          this.eventBus.publish(
            new StreamsProjectionMessage(streamId, revision, type, data),
          )
          this.logger.debug(
            `${STREAMS_PROJECTION}: Emitted event ${type} from stream ${streamId}.`,
            StreamsProjectionService.name,
          )
        }

        if (resolvedEvents.length < BATCH_SIZE) {
          this.logger.log(
            `Finished emitting all events from ${STREAMS_PROJECTION}.`,
            StreamsProjectionService.name,
          )
          return
        }
      }
    } catch (error) {
      if (error.type === ErrorType.STREAM_NOT_FOUND) {
        this.logger.error(
          `System projection ${STREAMS_PROJECTION} not found. Unable to execute catch-up for streams created while the read repository is down.`,
          StreamsProjectionService.name,
        )
      }
    }
  }
}
