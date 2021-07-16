import { Injectable } from '@nestjs/common'
import { PendingQuote } from 'src/domain/entities/pending-quote.entity'
import {
  ErrorType,
  EventStoreDBClient,
  ExpectedRevision,
  JSONRecordedEvent,
} from '@eventstore/db-client'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { convertDomainEventToJsonEvent } from '../utils/convert-domain-event-to-json-event.util'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { PENDING_QUOTE_REDUCERS } from '../reducers/pending-quote.reducer'
import { IPendingQuote } from 'src/domain/entities/pending-quote.interface'

// TODO follow the reducers of the read repository

@Injectable()
export class PendingQuoteWriteRepositoryService extends EsdbRepository<PendingQuote> {
  constructor(private client: EventStoreDBClient) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<PendingQuote>> {
    try {
      const resolvedEvents = await this.client.readStream(id)
      const events = resolvedEvents.map(
        ({ event }) => event as JSONRecordedEvent,
      )

      if (
        events.some(
          ({ type }) =>
            type === DomainEventNames.PENDING_QUOTE_ACCEPTED ||
            type === DomainEventNames.PENDING_QUOTE_CANCELLED,
        )
      ) {
        return null
      }

      const asObject = events.reduce<IPendingQuote>(
        (state, { data, type }) => PENDING_QUOTE_REDUCERS[type](data, state),
        null,
      )

      const [lastEvent] = events.reverse()

      return {
        entity: new PendingQuote(asObject),
        revision: lastEvent.revision,
      }
    } catch (e) {
      if (e.type === ErrorType.NO_STREAM) {
        return null
      }

      throw e
    }
  }

  async publishEvents(
    { events }: PendingQuote,
    expectedRevision: ExpectedRevision,
  ) {
    const [firstEvent] = events
    this.client.appendToStream(
      // We're going to trust that all aggregateIds here are the same
      firstEvent.aggregateId,
      events.map(convertDomainEventToJsonEvent),
      {
        expectedRevision,
      },
    )
  }
}
