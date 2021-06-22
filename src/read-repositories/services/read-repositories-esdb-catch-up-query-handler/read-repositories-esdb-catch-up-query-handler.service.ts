import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { EsdbCatchUpQuery } from 'src/read-repositories/esdb-catch-up.query'
import { EventStoreDBClient } from '@eventstore/db-client'
import { Logger } from '@nestjs/common'
import { ReadRepositoryEsdbEvent } from 'src/read-repositories/read-repository-esdb.event'

@QueryHandler(EsdbCatchUpQuery)
export class ReadRepositoriesEsdbCatchUpQueryHandlerService
  implements IQueryHandler<EsdbCatchUpQuery>
{
  constructor(
    private eventBus: EventBus,
    private client: EventStoreDBClient,
    private logger: Logger,
  ) {}

  async execute({
    fromRevision,
    streamName,
  }: EsdbCatchUpQuery): Promise<boolean> {
    const [resolvedEvent] = await this.client.readStream(streamName, {
      fromRevision: fromRevision,
      maxCount: 1,
    })

    if (!resolvedEvent) {
      this.logger.debug(
        `No events found in stream ${streamName} after revision ${fromRevision}.`,
        ReadRepositoriesEsdbCatchUpQueryHandlerService.name,
      )
      return false
    }

    const { revision, type, data } = resolvedEvent.event

    const eventToPublish = new ReadRepositoryEsdbEvent(
      streamName,
      revision,
      type,
      data,
    )

    this.eventBus.publish(eventToPublish)

    this.logger.debug(
      `Emitted revision ${revision} of stream ${streamName} with type ${type}.`,
      ReadRepositoriesEsdbCatchUpQueryHandlerService.name,
    )

    return true
  }
}
