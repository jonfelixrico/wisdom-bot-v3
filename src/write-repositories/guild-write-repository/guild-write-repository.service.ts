import { ExpectedRevision } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { Guild } from 'src/domain/entities/guild.entity'
import { GuildWriteRepository } from '../abstract/guild-write-repository.abstract'
import { DomainEventPublisherService } from '../domain-event-publisher/domain-event-publisher.service'
import { EsdbHelperService } from '../esdb-helper/esdb-helper.service'
import { GUILD_REDUCERS } from '../reducers/guild.reducer'
import { reduceEvents } from '../reducers/reducer.util'

@Injectable()
export class GuildWriteRepositoryService extends GuildWriteRepository {
  constructor(
    private helper: EsdbHelperService,
    private publisher: DomainEventPublisherService,
  ) {
    super()
  }

  async findById(id: string) {
    const events = await this.helper.readAllEvents(id)

    if (!events) {
      return null
    }

    const [entity, revision] = reduceEvents(events, GUILD_REDUCERS)

    return {
      entity: new Guild(entity),
      revision,
    }
  }

  async publishEvents(
    entity: Guild,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    await this.publisher.publishEvents(entity.events, expectedRevision)
  }
}
