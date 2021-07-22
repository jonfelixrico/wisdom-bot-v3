import { ExpectedRevision } from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { Receive } from 'src/domain/entities/receive.entity'
import { RECEIVE_REDUCERS } from '../reducers/recieve.reducer'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { reduceEvents } from '../reducers/reducer.util'
import { DomainEventPublisherService } from '../domain-event-publisher/domain-event-publisher.service'
import { EsdbHelperService } from '../esdb-helper/esdb-helper.service'

@Injectable()
export class ReceiveWriteRepositoryService extends EsdbRepository<Receive> {
  constructor(
    private pub: DomainEventPublisherService,
    private helper: EsdbHelperService,
  ) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<Receive>> {
    const events = await this.helper.readAllEvents(id)
    const [entity, revision] = reduceEvents(events, RECEIVE_REDUCERS)

    return {
      entity: new Receive(entity),
      revision,
    }
  }

  async publishEvents(
    { events }: Receive,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    await this.pub.publishEvents(events, expectedRevision)
  }
}
