import {
  ErrorType,
  EventStoreDBClient,
  ExpectedRevision,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { IReceiveEntity, Receive } from 'src/domain/entities/receive.entity'
import { RECEIVE_REDUCERS } from '../reducers/recieve.reducer'
import { convertDomainEventToJsonEvent } from '../utils/convert-domain-event-to-json-event.util'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { writeRepositoryReducerDispatcherFactory } from '../reducers/write-repository-reducer-dispatcher.util'

@Injectable()
export class ReceiveWriteRepositoryService extends EsdbRepository<Receive> {
  constructor(private client: EventStoreDBClient) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<Receive>> {
    try {
      const resolvedEvents = await this.client.readStream(id)
      const events = resolvedEvents.map(
        ({ event }) => event as JSONRecordedEvent,
      )

      const asObject = events.reduce<IReceiveEntity>(
        writeRepositoryReducerDispatcherFactory(RECEIVE_REDUCERS),
        null,
      )

      const [lastEvent] = events.reverse()
      return {
        entity: new Receive(asObject),
        revision: lastEvent.revision,
      }
    } catch (e) {
      if (e.type === ErrorType.STREAM_NOT_FOUND) {
        return null
      }

      throw e
    }
  }

  async publishEvents(
    { events }: Receive,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    const [firstEvent] = events
    await this.client.appendToStream(
      firstEvent.aggregateId,
      events.map(convertDomainEventToJsonEvent),
      {
        expectedRevision,
      },
    )
  }
}
