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
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { PENDING_QUOTE_REDUCERS } from '../reducers/pending-quote.reducer'
import { IPendingQuote } from 'src/domain/entities/pending-quote.interface'
import { writeRepositoryReducerDispatcherFactory } from '../reducers/write-repository-reducer-dispatcher.util'
import { DomainEventPublisherService } from '../domain-event-publisher/domain-event-publisher.service'

const {
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
} = DomainEventNames

const DISQUALIFIER_EVENTS = new Set<string>([
  PENDING_QUOTE_ACCEPTED,
  PENDING_QUOTE_CANCELLED,
  PENDING_QUOTE_EXPIRATION_ACKNOWLEDGED,
])

@Injectable()
export class PendingQuoteWriteRepositoryService extends EsdbRepository<PendingQuote> {
  constructor(
    private client: EventStoreDBClient,
    private pub: DomainEventPublisherService,
  ) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<PendingQuote>> {
    try {
      const resolvedEvents = await this.client.readStream(id)
      const events = resolvedEvents.map(
        ({ event }) => event as JSONRecordedEvent,
      )

      if (events.some(({ type }) => DISQUALIFIER_EVENTS.has(type))) {
        return null
      }

      const asObject = events.reduce<IPendingQuote>(
        writeRepositoryReducerDispatcherFactory(PENDING_QUOTE_REDUCERS),
        null,
      )

      const [lastEvent] = events.reverse()

      return {
        entity: new PendingQuote(asObject),
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
    { events }: PendingQuote,
    expectedRevision: ExpectedRevision,
  ) {
    await this.pub.publishEvents(events, expectedRevision)
  }
}
