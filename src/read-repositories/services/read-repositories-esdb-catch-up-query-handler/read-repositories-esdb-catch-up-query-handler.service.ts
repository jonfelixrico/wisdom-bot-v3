import { Injectable } from '@nestjs/common'
import { EventBus, IQueryHandler } from '@nestjs/cqrs'
import { EsdbCatchUpQuery } from 'src/read-repositories/esdb-catch-up.query'
import { EventStoreDBClient } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'

@Injectable()
export class ReadRepositoriesEsdbCatchUpQueryHandlerService
  implements IQueryHandler<EsdbCatchUpQuery>
{
  constructor(
    private eventBus: EventBus,
    private client: EventStoreDBClient,
    private logger: Logger,
  ) {}

  /**
   * This is for listening to EsdbCatchUpQuery instances emitted by what we assume are read models.
   * Like what we do with EsdbLiveEvents that we catch from the event bus, we emit the resuls
   * of the queries as ReadRepositoryEsdbEvent instances.
   * @param param0
   * @returns True if events are found, false if otherwise.
   */
  async execute({
    fromRevision,
    streamName,
    maxCount,
  }: EsdbCatchUpQuery): Promise<boolean> {
    const resolvedEvents = await this.client.readStream(streamName, {
      fromRevision,
      maxCount,
    })

    if (!resolvedEvents.length) {
      this.logger.debug(
        `No events found in stream ${streamName} after revision ${fromRevision}.`,
        ReadRepositoriesEsdbCatchUpQueryHandlerService.name,
      )
      return false
    }

    const eventToPublish = new ReadRepositoryEsdbEvent(
      streamName,
      resolvedEvents.map(({ event }) => {
        const { data, type, revision } = event
        return {
          data,
          type,
          revision,
        }
      }),
      'CATCH_UP',
    )

    this.eventBus.publish(eventToPublish)

    this.logger.debug(
      `Emitted ${resolvedEvents.length} events from stream ${streamName} starting from revision ${fromRevision}.`,
      ReadRepositoriesEsdbCatchUpQueryHandlerService.name,
    )

    return true
  }
}
