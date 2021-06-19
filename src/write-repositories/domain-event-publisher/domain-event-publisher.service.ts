import { Injectable } from '@nestjs/common'
import {
  EventStoreDBClient,
  ExpectedRevision,
  jsonEvent,
} from '@eventstore/db-client'
import { DomainEvent } from 'src/domain/abstracts/domain-event.abstract'

export interface IEventPublishOptions {
  expectedRevision?: ExpectedRevision
  aggregateIdFormatterFn?: (aggregateId: string) => string
}

const defaultAggregateFormatterFn = (id: string) => id

const checkIfEventsHaveSameAggregateId = <T extends DomainEvent = DomainEvent>([
  first,
  ...others
]: T[]) => others.every((event) => event.aggregateId === first.aggregateId)

@Injectable()
export class DomainEventPublisherService {
  constructor(private client: EventStoreDBClient) {}

  async publishEvents<T extends DomainEvent = DomainEvent>(
    events: T[],
    options?: IEventPublishOptions,
  ): Promise<void> {
    const {
      expectedRevision,
      aggregateIdFormatterFn = defaultAggregateFormatterFn,
    } = options || {}

    if (!checkIfEventsHaveSameAggregateId(events)) {
      throw new Error('Events must have the same aggregate id.')
    }

    const streamName = aggregateIdFormatterFn(events[0].aggregateId)
    const eventDataArr = events.map(({ payload, eventName }) =>
      jsonEvent({
        type: eventName,
        data: payload,
      }),
    )

    await this.client.appendToStream(streamName, eventDataArr, {
      expectedRevision,
    })
  }
}
