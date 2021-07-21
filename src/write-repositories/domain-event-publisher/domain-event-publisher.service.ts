import {
  AppendResult,
  EventStoreDBClient,
  ExpectedRevision,
} from '@eventstore/db-client'
import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'
import { DomainEventPublishedEvent } from '../events/domain-event-published.event'
import { convertDomainEventToJsonEvent } from './../utils/convert-domain-event-to-json-event.util'

@Injectable()
export class DomainEventPublisherService {
  constructor(private client: EventStoreDBClient, private eventBus: EventBus) {}

  async publishEvents(
    events: DomainEvent[] | DomainEvent,
    expectedRevision: ExpectedRevision,
  ) {
    if (!Array.isArray(events)) {
      events = [events]
    }

    const [firstEvent] = events
    if (events.some((e) => e.aggregateId !== firstEvent.aggregateId)) {
      throw new Error('All events must point to the same aggregate!')
    }

    let lastAppendResults: AppendResult

    for (const event of events) {
      lastAppendResults = await this.client.appendToStream(
        event.aggregateId,
        convertDomainEventToJsonEvent(event),
        {
          expectedRevision:
            lastAppendResults?.nextExpectedRevision ?? expectedRevision,
        },
      )

      this.eventBus.publish(
        new DomainEventPublishedEvent(
          event,
          lastAppendResults.nextExpectedRevision,
        ),
      )
    }

    return lastAppendResults
  }
}
