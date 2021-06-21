import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import {
  ErrorType,
  EventStoreDBClient,
  ReadRevision,
  START,
} from '@eventstore/db-client'
import { EventBus } from '@nestjs/cqrs'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'

const BATCH_SIZE = 100
const STREAMS_PROJECTION = '$streams'

@Injectable()
/**
 * This service uses ESDB's `$streams` projection to get the first events of ALL of our streams.
 * We're doing this so that the read models can be aware of the aggregates/streams that they have not
 * saved.
 */
export class ReadRepositoriesEsdbStartupService
  implements OnApplicationBootstrap
{
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
            resolveLinkTos: true,
          },
        )

        for (const { event } of resolvedEvents) {
          const { type, data, streamId, revision } = event
          fromRevision = revision

          this.eventBus.publish(
            new ReadRepositoryEsdbEvent(
              streamId,
              revision,
              type,
              data,
              'CATCH_UP',
            ),
          )
          this.logger.debug(
            `${STREAMS_PROJECTION}: Emitted event ${type} from stream ${streamId}.`,
            ReadRepositoriesEsdbStartupService.name,
          )
        }

        if (resolvedEvents.length < BATCH_SIZE) {
          this.logger.log(
            `Finished emitting all events from ${STREAMS_PROJECTION}.`,
            ReadRepositoriesEsdbStartupService.name,
          )
          return
        }
      }
    } catch (error) {
      if (error.type === ErrorType.STREAM_NOT_FOUND) {
        this.logger.error(
          `System projection ${STREAMS_PROJECTION} not found. Unable to execute catch-up for streams created while the read repository is down.`,
          ReadRepositoriesEsdbStartupService.name,
        )
      }
    }
  }
}
