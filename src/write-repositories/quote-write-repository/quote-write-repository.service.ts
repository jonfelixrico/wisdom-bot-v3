import {
  ErrorType,
  EventStoreDBClient,
  ExpectedRevision,
  JSONRecordedEvent,
  NO_STREAM,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { DomainEventNames } from 'src/domain/domain-event-names.enum'
import { IQuoteEntity, Quote } from 'src/domain/entities/quote.entity'
import { QUOTE_REDUCERS } from './../reducers/quote.reducer'
import {
  EsdbRepository,
  IEsdbRepositoryEntity,
} from '../abstract/esdb-repository.abstract'
import { QuoteReceivedEvent } from 'src/domain/events/quote-received.event'
import { ReceiveCreatedEvent } from 'src/domain/events/receive-created.event'
import { convertDomainEventToJsonEvent } from './../utils/convert-domain-event-to-json-event.util'

@Injectable()
export class QuoteWriteRepositoryService extends EsdbRepository<Quote> {
  constructor(private client: EventStoreDBClient) {
    super()
  }

  async findById(id: string): Promise<IEsdbRepositoryEntity<Quote>> {
    try {
      const resolvedEvents = await this.client.readStream(id)
      const events = resolvedEvents.map(
        ({ event }) => event as JSONRecordedEvent,
      )

      if (
        !events.some(
          ({ type }) => type === DomainEventNames.PENDING_QUOTE_ACCEPTED,
        )
      ) {
        /*
         * If PENDING_QUOTE_ACCEPTED was not found, then this quote has not reached the accepted status. Hence, the Quote
         * entity for this id technically doesn't exist yet.
         */
        return null
      }

      const asObject = events.reduce<IQuoteEntity>((state, { data, type }) => {
        const reducer = QUOTE_REDUCERS[type]
        return reducer ? reducer(data, state) : state
      }, null)

      const [lastEvent] = events.reverse()

      return {
        entity: new Quote(asObject),
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
    entity: Quote,
    expectedRevision: ExpectedRevision,
  ): Promise<void> {
    let nextRev: ExpectedRevision = expectedRevision

    for (const event of entity.events) {
      const streamName = event.aggregateId

      if (event instanceof QuoteReceivedEvent) {
        const { nextExpectedRevision } = await this.client.appendToStream(
          streamName,
          convertDomainEventToJsonEvent(event),
          {
            expectedRevision: nextRev,
          },
        )

        nextRev = nextExpectedRevision
      } else if (event instanceof ReceiveCreatedEvent) {
        await this.client.appendToStream(
          streamName,
          convertDomainEventToJsonEvent(event),
          {
            // We're statically expecting NO_STREAM here because this event is the root event for receive streams
            expectedRevision: NO_STREAM,
          },
        )
      } else {
        // TODO do checking if all events received here are for the quote event only
      }
    }
  }
}
